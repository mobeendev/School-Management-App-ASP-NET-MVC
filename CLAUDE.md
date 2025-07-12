# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a School Management App built with **Clean Architecture** using ASP.NET Core 8.0 and Entity Framework Core, with SQLite as the database. The application implements role-based authentication with three roles: Admin, Lecturer, and Student.

## Clean Architecture Structure

### 5-Layer Architecture
```
SchoolManagement.sln
├── SchoolManagement.Models/      # Domain entities, DTOs, enums
├── SchoolManagement.Services/    # Business logic and application services
├── SchoolManagement.Repositories/ # Data access layer with repository pattern
├── SchoolManagement.Api/         # Controllers for HTTP request handling
└── SchoolManagementApp/          # Main web project (startup, configuration)
    └── Frontend/                 # Views, static files, UI components
        ├── Views/                # Razor templates
        └── wwwroot/              # Static assets (CSS, JS, images)
```

## Development Commands

### Build and Run
```bash
# Build the entire solution
dotnet build

# Run the main web application
dotnet run

# Run with hot reload
dotnet watch run
```

### Database Operations
```bash
# Create a new migration (from main project directory)
dotnet ef migrations add [MigrationName] --project SchoolManagement.Repositories

# Update database with pending migrations
dotnet ef database update --project SchoolManagement.Repositories

# Drop database (SQLite file will be deleted)
dotnet ef database drop --project SchoolManagement.Repositories
```

### Testing
```bash
# Run tests (if test project exists)
dotnet test
```

## Architecture Details

### Models Layer (`SchoolManagement.Models`)
- **Entities**: Clean domain entities without EF annotations
- **DTOs**: Data transfer objects for service communication
- **Enums**: Business enums (Qualification, SemesterType)
- **Dependencies**: Microsoft.AspNetCore.Identity.EntityFrameworkCore

### Services Layer (`SchoolManagement.Services`)
- **Interfaces**: Service contracts (IStudentService, ICourseService, ILecturerService)
- **Implementations**: Business logic with entity-DTO mapping
- **Helpers**: Utility services
- **Dependencies**: Models, Repositories

### Repositories Layer (`SchoolManagement.Repositories`)
- **Interfaces**: Repository contracts (IStudentRepository, ICourseRepository, etc.)
- **Implementations**: Data access implementations
- **Context**: SchoolManagementDbContext with EF configurations
- **Migrations**: Database migration files
- **Dependencies**: Models, Entity Framework Core

### API Layer (`SchoolManagement.Api`)
- **Controllers**: All HTTP request handlers (MVC + API)
- **BaseController**: Common controller functionality
- **Dependencies**: Models, Services, ASP.NET Core MVC

### Frontend Layer (`Frontend/`)
- **Views**: All Razor templates organized by feature
- **wwwroot**: Static assets (CSS, JS, images)
- **ViewModels**: UI-specific models (to be created as needed)

## Key Entities
- **ApplicationUser**: Identity user with custom properties
- **Student**: Student information and enrollment tracking
- **Lecturer**: Lecturer details linked to ApplicationUser
- **Course**: Course definitions
- **Class**: Class instances linked to courses and semesters
- **ClassSchedule**: Class timing and lecturer assignments
- **Enrollment**: Student-course relationships
- **Attendance**: Student attendance tracking
- **Semester**: Academic term management

## Dependency Injection Configuration
All services are registered in `Program.cs`:
- **DbContext**: SchoolManagementDbContext with SQLite
- **Identity**: ASP.NET Core Identity services
- **Repositories**: All repository interfaces and implementations
- **Services**: All business service interfaces and implementations

## Database Configuration
- **Provider**: SQLite
- **Connection String**: `"Data Source=SchoolDB.db"`
- **Location**: `SchoolDB.db` in project root
- **Migrations**: Located in `SchoolManagement.Repositories/Migrations/`

## Frontend Configuration
- **View Location**: `/Frontend/Views/{Controller}/{Action}.cshtml`
- **Static Files**: `/Frontend/wwwroot/`
- **UI Framework**: Bootstrap, jQuery, DataTables, SweetAlert2

## Important Notes
- **No Unit of Work Pattern**: Direct repository usage for simplicity
- **No Separate Mappers**: Entity-DTO mapping handled in services
- **All Controllers in API Layer**: Centralized request handling
- **Clean Separation**: Each layer has distinct responsibilities
- **Time Restrictions**: Attendance updates have time limitations
- **Role-Based Access**: Enforced across all major operations