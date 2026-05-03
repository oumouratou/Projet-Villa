<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## API Endpoints

### Authentication

*   `POST /api/register`: Register a new user.
*   `POST /api/login`: Login a user and get a token.
*   `POST /api/logout`: Logout a user and invalidate the token.

### Users

*   `GET /api/users`: Get all users.
*   `POST /api/users`: Create a new user.
*   `GET /api/users/{id}`: Get a specific user.
*   `PUT /api/users/{id}`: Update a specific user.
*   `DELETE /api/users/{id}`: Delete a specific user.

### Roles

*   `GET /api/roles`: Get all roles.
*   `POST /api/roles`: Create a new role.
*   `GET /api/roles/{id}`: Get a specific role.
*   `PUT /api/roles/{id}`: Update a specific role.
*   `DELETE /api/roles/{id}`: Delete a specific role.

### Permissions

*   `GET /api/permissions`: Get all permissions.
*   `POST /api/permissions`: Create a new permission.
*   `GET /api/permissions/{id}`: Get a specific permission.
*   `PUT /api/permissions/{id}`: Update a specific permission.
*   `DELETE /api/permissions/{id}`: Delete a specific permission.

### Clients

*   `GET /api/clients`: Get all clients.
*   `POST /api/clients`: Create a new client.
*   `GET /api/clients/{id}`: Get a specific client.
*   `PUT /api/clients/{id}`: Update a specific client.
*   `DELETE /api/clients/{id}`: Delete a specific client.

### Bien Immobiliers

*   `GET /api/bien-immobiliers`: Get all properties.
*   `POST /api/bien-immobiliers`: Create a new property.
*   `GET /api/bien-immobiliers/{id}`: Get a specific property.
*   `PUT /api/bien-immobiliers/{id}`: Update a specific property.
*   `DELETE /api/bien-immobiliers/{id}`: Delete a specific property.

### Options

*   `GET /api/options`: Get all options.
*   `POST /api/options`: Create a new option.
*   `GET /api/options/{id}`: Get a specific option.
*   `PUT /api/options/{id}`: Update a specific option.
*   `DELETE /api/options/{id}`: Delete a specific option.

### Reservations

*   `GET /api/reservations`: Get all reservations.
*   `POST /api/reservations`: Create a new reservation.
*   `GET /api/reservations/{id}`: Get a specific reservation.
*   `PUT /api/reservations/{id}`: Update a specific reservation.
*   `DELETE /api/reservations/{id}`: Delete a specific reservation.

### Reclamations

*   `GET /api/reclamations`: Get all complaints.
*   `POST /api/reclamations`: Create a new complaint.
*   `GET /api/reclamations/{id}`: Get a specific complaint.
*   `PUT /api/reclamations/{id}`: Update a specific complaint.
*   `DELETE /api/reclamations/{id}`: Delete a specific complaint.
