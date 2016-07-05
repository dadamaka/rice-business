# Business Service
Rice business provides and serves restaurant and rating information for Rice. 

## Table of Contents
1. [Getting started](#Getting-Started)
  1. [Clone the latest version](#Installing-Dependencies)
  2. [Install Dependencies](#Installing-Dependencies)
  3. [Setup Environment Variables](#Environment-Variables)
  4. [Start the application](#Start-application)
2. [Dropping the Database](#database)
3. [Technologies] (#technologies)
3. [Architecture](#Architecture)
4. [Team](#Team)
5. [Contributing](#Contributing)

## Getting started
#### 1. Clone the latest version

  Start by cloning the latest version of rice-business on your local machine by running:

  ```sh
  $ git clone https://github.com/dadamaka/rice-business
  $ cd rice-business
  ```
  
#### 2. Install Dependencies
  From within the root directory run the following command to install all dependencies:

  ```sh
  $ npm install
  ```
  
#### 3. Setup Environment Variables

##### Server side setup

  1. Copy and save the  ``` example.env ``` file in the env folder as ``` development.env ```.
  2. Enter your desired ```PORT```

#### 4. Run the application

1. Start the server by running the following command from the root directory:

    ```sh
    $ npm start
    ```
2. Your server is now live at ```http://localhost:PORT```
#### 5. Run tests

1. Run the follow command from the root directory to run database query tests.
    ```sh
    $ npm test
    ```
## Dropping the database

1. Run the following command from the root directory:

    ```sh
    $ npm run drop
    ```




