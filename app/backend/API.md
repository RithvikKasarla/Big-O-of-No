# API endpoints

## User/Authentication

### Signup

- Post URL/auth/signup

  - ```json
    {
    "username" : "", //Required, Unique
    "password" : "", //Required
    "email": "", //Required
    "birthday": "", //Required, ISO8601
    "name": "", //Required
    "family_name": "", //Required
    }
    ```
  - Returns:

    - 500
      - `{"message":"failed @ cognito"}`
    - 200
      - `{"message":"success"}`
      - 
      - Signin

## Files

## Posts

## Class
