# Olla [Interview] Feature Flags Service

## Environment Set Up:

We rely quite a bit on Docker for our local development environments, automated testing, and automated deployments.

To run a service locally....

#### Prerequisites
1) Have [docker](https://www.docker.com/) installed. 
2) Have [docker-compose](https://docs.docker.com/compose/install/) installed.

[Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/install/) comes with docker-compose, as does [Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/install/).
   
#### Running the service locally

1. ```git clone``` this repo. (only needs to be done once)
2. ```cd featureflags```
3. ```docker-compose build feature-flag-database``` (only needs to be done once)
4. ```docker-compose build feature-flag-api``` (only needs to be done once)
5. ```docker-compose build feature-flag-dashboard``` (only needs to be done once)
6. ```docker-compose up feature-flag-dashboard```

At this point, visiting [local host](http://0.0.0.0:9998/) on port `9998` should result in the log in screen for our feature flag service.

In order to log in, you need to create an account with the following command:

    docker-compose exec feature-flag-api python manage.py createsuperuser

...and satisfy the inputs when prompted.

If you get a `featureflags database not found` error, you have to create the database manually and can do so with the following commands and then attempt to run step 6 from above again:
```
$ cd /your/path/to/interview-test-directory
$ docker-compose stop (this will stop all the containers, just to be sure wires don't get crossed)
$ docker-compose up feature-flag-database
$ docker-compose exec feature-flag-database bash (this effectively "sshes" you into the database container)
ffdb$ psql -U postgres -l (this will show you the current databases and featureflags won't exist)
ffdb$ su - postgres (become a postgres super user)
ffdb$ psql -c "CREATE DATABASE featureflags" (will create the database)
ffdb$ psql -U postgres -l (this will show you the current databases and featureflags should exist now)
ffdb$ exit (exit the container)
```

Then you may log in with the credentials you provided.

The services that should be running are as follows and can be seen by running `docker-compose ps`:

Frontend: `feature-flag-dashboard` on port `9998`

Backend: `feature-flag-api` on port `9999`

Database: `feature-flag-database` on port `9997`


## Frontend Documentation:

The frontend dashboard is a React + TypeScript application. It allows you to view, create, edit, and delete feature flags.

### Principals Used

#### Domain-Driven Design (DDD)

DDD is used to help create a two-way understanding of our software between engineers and the product owners.a
A `Domain` is defined as "A sphere of knowledge, influence, or activity". Every domain is derived from a given 
`Context`. A context is the setting in which a domain (or statement) appears that determines its meaning. 

In DDD, a `Model` is central to the understanding of each domain. Given that this application is written in 
TypeScript, its type-system is used to define our `Model` using `interface`s and `type` aliases only.

#### Onion Architecture

Sometimes called "Hexagonal Architecture" or the "Ports and Adapters" pattern, onion architecture is a way of 
structuring your application. This architecture is not appropriate for small websites. It is appropriate for long-lived business 
applications as well as applications with complex behavior.  It emphasizes the use of interfaces for behavior contracts, and 
it forces the externalization of infrastructure (side-effects, http requests, databases, etc). It relies heavily on the 
[dependency inversion](https://en.wikipedia.org/wiki/Dependency_inversion_principle) principal, a method of writing loosely coupled
software components.

### Application Structure

#### Entrypoint

The entrypoint to this applications can be found within `source/client.tsx`. This file brings together all of the 
effectful functionality from the `infrastructure` folder and, through React, marries this with the user interface.

#### Common `source/common`

This is a bit of a catch-all folder for functionality that either
does not fit with the domain services and/or is shared across multiple other directories.

#### Domain `source/domain`

The definition of our domain model and the services that perform business logic
directly related to it.

##### Model `source/domain/model`

Our domain model types.

##### Services `source/domain/services`

Our services that perform business logic operating on values defined in our domain model. These bring the business direct value and should be covered by unit tests. 

#### Infrastructure `source/infrastructure`

This folder is home to all of the functionality that perfoms side-effects and/or communicates with the outside world.
#### Server `source/server`

All code related to running our node servers

#### UI `source/ui`

All React-specific code

##### Components `source/ui/components`

All self-contained React components 

##### Context `source/ui/context`

All functionality that makes use of React's Context API

##### Hooks `source/ui/hooks`

All functionality that makes use of React's Hooks API. This is where the majority of functionality really comes together.
They act as the bridge between the `infrastructure` and the UI itself. Many of these hooks are then "lifted" into the Context API,
and will be found in the `source/ui/context` folder

##### Views `source/ui/views`

All screens/pages that a viewable within the application. They 
are all collections of components, contexts, and hooks in order to bring 
a fully-functional screen together to match our desired feature-set.

### Resources

#### Domain Driven Design

- https://martinfowler.com/tags/domain%20driven%20design.html
- https://www.thoughtworks.com/insights/blog/domain-driven-design-services-architecture
- https://www.infoq.com/articles/ddd-in-practice/
- https://dzone.com/refcardz/getting-started-domain-driven?chapter=1

#### Onion Architecture

- https://dzone.com/articles/hexagonal-architecture-what-is-it-and-how-does-it
- https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/
- https://medium.com/@Killavus/hexagonal-architecture-in-javascript-applications-and-how-it-relates-to-flux-349616d1268d

## Backend Documentation:

### Application Structure


It's a good idea to set up a virtual environment within the new service directory to be used as the Python intrepreter for PyCharm (should you be using it)... this can be done by running `virtualenv -p python3 .` in the new service directory.

Install managed requirements by:

`source bin/activate`

`pip install -r ./managed/requirements.txt`

Install local requirements by:

`pip install -r ./local/requirements.txt`

Exit the virtual environment with `deactivate`

~~*Note: this repo contains [submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) of each managed components for each service.~~

The `managed/` directory is normally a submodule that is maintained outside this template/the individual services and should not be modified 
for a single service. Use the `local/` or `app/` directories for service specific dependencies and changes.

~~**NOTE: The `managed/` folder will be always updated on deployment**~~

~~**DO NOT PUT SERVICE SPECIFIC CHANGES IN THE MANAGED FOLDER**~~

~~**DO NOT EXPECT TO BE ABLE TO DEPLOY AN OLD MANAGED FOLDER COMMIT**~~

#### The folder structure is as follows:

        .
        |
        +-- app/ # Go crazy, this is where the new service basically lives
        |   +-- constants/   # Constants for the featureflag app
        |   +-- helpers/     # Helper functions/classes for the featureflag app
        |   +-- migrations/     # Migrations for the featureflag app
        |   +-- models.py     # Models for the featureflag app
        |   +-- views.py     # Views functions/classes for the featureflag app
        |
        +-- local/
        |   +-- constants/   # Where featureflag app constants can be added
        |   +-- settings/   # Where featureflag app settings can be added
        |   +-- tests/   # Where featureflag app tests can be created
        |   +-- requirements.txt   # Where featureflag app requirements/dependencies can be added
        |   +-- urls.py   # Where featureflag app urls can be added
        |
        +-- managed/ # This is normally a managed submodule
        |   +-- # contains
        |   +-- # lots
        |   +-- # of
        |   +-- # common
        |   +-- # goodies
        |
        +-- manage.py # This should be able to run as-is
        +-- Dockerfile # This should be able to run as-is
        +-- wsgi.py # This should be able to run as-is
        +-- README.md # This file - probably should be updated to reflect the service


### Available Endpoints

#### Response Structure.

The api responses for this service follow the format as shown by the following example:

    {
        "request": {
            ...
        },
        "response": {
            ...
        },
        "success": true
    }

The three main parts of the response body consist of:

`request: {...}` - The original request parameters as received.

`response: {...}` - The response payload.

`success: true/false` - If the request was successfully completed or not

#### GET

##### featureflag/

`GET http://0.0.0.0:9999/app/v1/featureflag/?flagName=test`

This end point takes a required `flagName` as the query parameter and returns all the details for that specific flag.

Returns:

    {
        "request": {
            "flagName": "test",
            "store_location_id": null,
            "history": false,
            "deleted": false,
            "long_term": false
        },
        "response": {
            "active": true,
            "deleted": false,
            "description": "",
            "store_specific": false,
            "enabled": true,
            "name": "test",
            "activated_at": "2020-02-24 17:34:03.221999",
            "long_term": false,
            "store_locations": []
        },
        "success": true
    }
    
or if the flag does not exist:
    
    {
        "request": {
            "flagName": "test3",
            "store_location_id": null,
            "history": false,
            "deleted": false,
            "long_term": false
        },
        "error": "Flag not found.",
        "exceptionMessage": "None",
        "success": false
    }
    
or if `flagName` was not provided:
    
    {
        "request": null,
        "error": "flagName is required.",
        "exceptionMessage": "None",
        "success": false
    }
    

Additional optional arguments include:

`includeDeleted` - which includes deleted flags normally filtered out of the response.

`includeHistory` - which includes the history for the flag

`includeLongTerm` - which includes flags marked as "Long Term"

for example, the following end point

`http://0.0.0.0:9999/app/v1/featureflag/?flagName=test&includeHistory`

Will return the following response:

    {
        "request": {
            "flagName": "test",
            "store_location_id": null,
            "history": true,
            "deleted": false,
            "long_term": false
        },
        "response": {
            "active": true,
            "deleted": false,
            "description": "",
            "store_specific": false,
            "enabled": true,
            "name": "test",
            "activated_at": "2020-02-24 17:34:03.221999",
            "long_term": false,
            "store_locations": [],
            "history": [
                {
                    "active": true,
                    "deleted": false,
                    "description": "",
                    "enabled": true,
                    "history_date": "2020-02-24 17:34:03.228741",
                    "history_change_reason": null,
                    "history_type": "~",
                    "history_user": null,
                    "long_term": false
                },
                {
                    "active": false,
                    "deleted": false,
                    "description": "",
                    "enabled": true,
                    "history_date": "2020-02-24 17:34:02.619408",
                    "history_change_reason": null,
                    "history_type": "~",
                    "history_user": null,
                    "long_term": false
                },
                {
                    "active": false,
                    "deleted": false,
                    "description": "",
                    "enabled": false,
                    "history_date": "2020-02-24 17:33:58.201556",
                    "history_change_reason": null,
                    "history_type": "+",
                    "history_user": null,
                    "long_term": false
                }
            ]
        },
        "success": true
    }

##### GET a specific feature flag status
##### featureflag/status/

`GET http://0.0.0.0:9999/app/v1/featureflag/status/?flagName=test`

Returns

    {
        "request": {
            "flagName": "test",
            "store_location_id": null
        },
        "response": {
            "activeStatus": true
        },
        "success": true
    }
    
##### GET all the feature flags
##### featureflags/

`http://0.0.0.0:9999/app/v1/featureflags/`

Returns

    {
        "request": {
            "history": false,
            "deleted": false,
            "long_term": false
        },
        "response": [
            {
                "active": true,
                "deleted": false,
                "description": "",
                "store_specific": false,
                "enabled": true,
                "name": "test",
                "activated_at": "2020-02-24 17:34:03.221999",
                "long_term": false,
                "store_locations": []
            },
            {
                "active": true,
                "deleted": false,
                "description": "",
                "store_specific": false,
                "enabled": true,
                "name": "test2",
                "activated_at": "2020-02-24 17:39:19.372071",
                "long_term": false,
                "store_locations": []
            }
        ],
        "success": true
    }
    
Additional optional arguments include:

`includeDeleted` - which includes deleted flags normally filtered out of the response.

`includeHistory` - which includes the history for the flag

`includeLongTerm` - which includes flags marked as "Long Term"


##### GET all the feature flag statuses
##### featureflag/statuses/

`GET http://0.0.0.0:9999/app/v1/featureflag/statuses/`
    
Returns

    {
        "request": null,
        "response": {
            "test": true,
            "test2": true
        },
        "success": true
    }
    

#### PUT

##### featureflag/

`PUT http://0.0.0.0:9999/app/v1/featureflag/` 

This end point takes a required `flagName` as the the body payload as well as a number of optional parameters.

Optional Parameters:

`flagDescription` - A test description of the flag (string)

`status` - The active status of the flag (true/false)

~~`storeSpecific` - If the flag is store specific or not (true/false)~~ Don't worry about this

~~`storeLocations` - An array of store location ID's (array)~~ Don't worry about this

`longTerm` - If the flag is long term or not (true/false)

Example `JSON` payload of:

    {
        "flagName": "test",
        "flagDescription": "Some descriptive description"
    }
  
Would update the description and returns:

    {
        "request": {
            "flagName": "test",
            "status": null,
            "flagDescription": "Some descriptive description",
            "storeSpecific": false,
            "storeLocations": [],
            "longTerm": false
        },
        "response": {
            "active": false,
            "deleted": true,
            "description": "Some descriptive description",
            "store_specific": false,
            "enabled": false,
            "name": "test",
            "activated_at": "2020-02-24 17:34:03.221999",
            "long_term": false,
            "store_locations": [],
            "history": [
                {
                    "active": false,
                    "deleted": true,
                    "description": "Some descriptive description",
                    "enabled": false,
                    "history_date": "2020-02-24 18:06:03.248727",
                    "history_change_reason": null,
                    "history_type": "~",
                    "history_user": null,
                    "long_term": false
                },
                {
                    "active": false,
                    "deleted": true,
                    "description": "",
                    "enabled": false,
                    "history_date": "2020-02-24 17:57:55.048358",
                    "history_change_reason": null,
                    "history_type": "~",
                    "history_user": null,
                    "long_term": false
                },
                {
                    "active": true,
                    "deleted": false,
                    "description": "",
                    "enabled": true,
                    "history_date": "2020-02-24 17:34:03.228741",
                    "history_change_reason": null,
                    "history_type": "~",
                    "history_user": null,
                    "long_term": false
                },
                {
                    "active": false,
                    "deleted": false,
                    "description": "",
                    "enabled": true,
                    "history_date": "2020-02-24 17:34:02.619408",
                    "history_change_reason": null,
                    "history_type": "~",
                    "history_user": null,
                    "long_term": false
                },
                {
                    "active": false,
                    "deleted": false,
                    "description": "",
                    "enabled": false,
                    "history_date": "2020-02-24 17:33:58.201556",
                    "history_change_reason": null,
                    "history_type": "+",
                    "history_user": null,
                    "long_term": false
                }
            ]
        },
        "success": true
    }   

#### POST

##### featureflag/

`POST http://0.0.0.0:9999/app/v1/featureflag/` 

This end point takes a required `flagName` as the the body payload to create a flag.

Optional Parameters:

`flagDescription` - A test description of the flag (string)

`longTerm` - If the flag is long term or not (true/false)

Example `JSON` payload of:

    {"flagName": "another-test"}

Returns:
    
    {
        "request": {
            "flagName": "another-test",
            "flagDescription": "",
            "longTerm": null
        },
        "response": {
            "active": false,
            "deleted": false,
            "description": "",
            "store_specific": false,
            "enabled": false,
            "name": "another-test",
            "activated_at": null,
            "long_term": false,
            "store_locations": [],
            "history": [
                {
                    "active": false,
                    "deleted": false,
                    "description": "",
                    "enabled": false,
                    "history_date": "2020-02-24 18:08:58.908083",
                    "history_change_reason": null,
                    "history_type": "+",
                    "history_user": null,
                    "long_term": false
                }
            ]
        },
        "success": true
    }
    
Whereas this `JSON` payload:

    {
        "flagName": "test-with-description",
        "flagDescription": "some test description"
    }

Returns:

    {
        "request": {
            "flagName": "test-with-description",
            "flagDescription": "some test description",
            "longTerm": null
        },
        "response": {
            "active": false,
            "deleted": false,
            "description": "some test description",
            "store_specific": false,
            "enabled": false,
            "name": "test-with-description",
            "activated_at": null,
            "long_term": false,
            "store_locations": [],
            "history": [
                {
                    "active": false,
                    "deleted": false,
                    "description": "some test description",
                    "enabled": false,
                    "history_date": "2020-02-24 18:09:45.224549",
                    "history_change_reason": null,
                    "history_type": "+",
                    "history_user": null,
                    "long_term": false
                }
            ]
        },
        "success": true
    }

#### DELETE

##### featureflag/

`DELETE http://0.0.0.0:9999/app/v1/featureflag/` 

This end point is used to "delete" a feature flag and takes a required `flagName` as the the body payload.

Deleting a feature flag sets it as deleted, disabled, AND inactive.

Example `JSON` payload of:

    {"flagName": "test"}

Returns:

    {
        "request": {
            "flagName": "test"
        },
        "response": {
            "active": false,
            "deleted": true,
            "description": "",
            "store_specific": false,
            "enabled": false,
            "name": "test",
            "activated_at": "2020-02-24 17:34:03.221999",
            "long_term": false,
            "store_locations": [],
            "history": [
                {
                    "active": false,
                    "deleted": true,
                    "description": "",
                    "enabled": false,
                    "history_date": "2020-02-24 17:57:55.048358",
                    "history_change_reason": null,
                    "history_type": "~",
                    "history_user": null,
                    "long_term": false
                },
                {
                    "active": true,
                    "deleted": false,
                    "description": "",
                    "enabled": true,
                    "history_date": "2020-02-24 17:34:03.228741",
                    "history_change_reason": null,
                    "history_type": "~",
                    "history_user": null,
                    "long_term": false
                },
                {
                    "active": false,
                    "deleted": false,
                    "description": "",
                    "enabled": true,
                    "history_date": "2020-02-24 17:34:02.619408",
                    "history_change_reason": null,
                    "history_type": "~",
                    "history_user": null,
                    "long_term": false
                },
                {
                    "active": false,
                    "deleted": false,
                    "description": "",
                    "enabled": false,
                    "history_date": "2020-02-24 17:33:58.201556",
                    "history_change_reason": null,
                    "history_type": "+",
                    "history_user": null,
                    "long_term": false
                }
            ]
        },
        "success": true
    }

## Database Documentation:

### Connection Details:

    User: postgres
    Host: localhost
    Password: [blank]
    Database: featureflags
    Port: 9997
    
[Psequal](http://www.psequel.com/) is recommended but any Postgres GUI is fine. 

The only relevant table is `app_featureflag` which is where the flags are stored.

The `app_featureflagbystore` table is for a functionality that is not included in this service.

`app_historical_*` tables are managed by a history tracking package.

`auth*` and `django_*` tables are managed by Django 

## Known Bugs

1. Log in form doesn't submit when hitting `Return`

    a. **Fix:** Just manually press the `Sign In` button
    
2. Making a change doesn't necessarily invalidate the cache/update the view.

    a. **Fix** Just refresh the page 

3. Sending a PUT/POST/DELETE request without a JSON payload returns a 500 error.

    a. **Fix:** Don't send those requests without payloads.
    
## Extra Docker Notes:
If things get out of hand, simply delete everything, start these instructions over, and you're back in business. [Easy-peasy](http://abcnews.go.com/images/ABC_Univision/uni_snoopoverstockad1_wmain.jpg).

Commands you'll find useful when using docker:

Stop the containers:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```ctrl+c``` after ```docker-compose up```

or

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```docker-compose stop```

Run in "detached" mode (aka, no log flow):

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```docker-compose up -d```

Flow logs from containers running in detached mode:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```docker-compose [service] -f```

Stop a specific service:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```docker-compose stop [service]```

Start/restart a specific service:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```docker-compose up [service]```

Build/rebuild a specific service:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```docker-compose build [service]```

Build/rebuild a specific service without using cached info:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```docker-compose build --no-cache [service]```

Build/rebuild a everything without using cached info:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```docker-compose build --no-cache```

You can also run specific commands with:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```docker-compose exec [service] [command]```

Stopping and removing all containers:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```docker-compose down -v```

Burn it all to the ground: *Note, this will require rebuilding everything

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```docker-compose down -v```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```docker system prune --all --volumes```
