# Done:
-   Created Authentication Backend (Register and Login)
-   Seperated the different authentication actions (login and register) into services in the backend.
-   Created a sidebar to the dashboard.
-   Created two service:
    - AuthService, handles the different actions related to authentication: 
        -   Login in (hitting the /login API end-point).
        -   Register (hitting the /signup API end-point).
        -   PurgeAuth (deletes the JWT from the local storage, resets the BehaviourSubject to it's initials value (an empty object), and set the "authenticated" variable for false).
        -   isAuthenticated (Checks whether the user is authenticated or not by return "authenticated"'s boolean value ).
    - JWTService, operations on token:
        - setToken (Sets the JWT in localstorage).
        - getToken (Gets the JWT from localstorage).
        - deleteToken (Delete the JWT from localstorage).
-   Protect the access to the dashboard using a Guard.

# TODO:
-   Contiune implementing the Seperation of Concers concept:
    - Create an "Auth" module that contains Login and Signup components.
    - Create a "Shared" module that contains different common components (Services, Guards) or any other future shared components.
    - Same thing for "dashboard" componenet.