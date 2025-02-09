using Microsoft.EntityFrameworkCore;
using SchoolManagementApp.Data;
using SchoolManagementApp.Services;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<SchoolManagementDbContext>(options =>
options.UseSqlite(builder.Configuration.GetConnectionString("SchoolDBConnection")));
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<SchoolManagementDbContext>();
builder.Services.AddScoped<DropdownService>();

builder.Services.AddSession();


var app = builder.Build();

// Seed roles and users
await DataSeeder.SeedRolesAndUsers(app);

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.UseSession();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();