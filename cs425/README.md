# Done:
-   Created Authentication Backend (Register and Login)
-   Seperated the different authentication actions (login and register) into services in the backend.
-   Created a sidebar to the dashboard.
-   Create two service: AuthService that handles the different actions related to authentication :
    - AuthService:
        -   Login in (hitting the /login API end-point).
        -   Register (hitting the /signup API end-point).
        -   PurgeAuth (deletes the JWT from the local storage, resets the BehaviourSubject to it's initials value (an empty object), and set the "authenticated" variable for false).
        -   isAuthenticated (Checks whether the user is authenticated or not by return "authenticated"'s boolean value ).