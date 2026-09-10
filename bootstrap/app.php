<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Console\ServeCommand;
use Illuminate\Http\Request;

// Ensure Windows temporary file directories are passed to the artisan serve child process
if (class_exists(ServeCommand::class)) {
    ServeCommand::$passthroughVariables[] = 'TEMP';
    ServeCommand::$passthroughVariables[] = 'TMP';
    ServeCommand::$passthroughVariables[] = 'USERPROFILE';
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
