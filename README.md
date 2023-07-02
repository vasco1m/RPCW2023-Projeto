# BDACORDAOS

This is a README file for the provided code. Below you will find information about the functionalities, code structure, models, endpoints, views and optimizations.

## Code Description

The code provided is a Node.js application that uses the Express.js framework. It consists of a set of routes defined using the Express Router. The code utilizes various modules and controllers to handle different functionalities.

The main dependencies used in this code are:
- Express.js: A web application framework for Node.js.
- Nodemailer: A module for sending emails.
- Email-Templates: A module for sending email templates.
- Mongoose: An Object Data Modeling (ODM) library for MongoDB.

## Datasets
The datasets used in this project were provided by the professor, and they can be found in this [link](https://drive.google.com/drive/folders/1pJUTOVOGeo1uMxX9WywBrQUmKPKr-EIG?usp=sharing).


## Installation and Setup

To run this code locally, please follow these steps:

1. Ensure that you have Node.js and npm installed on your machine.
2. Clone the code repository to your local machine and navigate to the project directory.
3. Install the dependencies by running the following command:
   ```
   npm install
   ```
4. Start the application by running the following command:
   ```
   npm start
   ```
   The application will start running on `http://localhost:7024`.


## Functionalities
This project contains lots of resourceful functionalities that can be used to manage and search for portuguese court decisions. As main functionalities, the project allows the user to:
- Register and login to the application.
- See all court decisions and their details.
- Search by taxonomy of court decisions.
- Search a court decision by a value.
- Filter court decisions based on court.
- Search for court decisions based on different criteria. (Logged in users only)
- Add court decisions to favorites, with a marker to easily identify them. (Logged in users only)
- Edit court decisions. (Admin only)
- Make a edit suggestion for a court decision. (Logged in users only)
- Add a court decision. (Admin only)
- Add a court. (Admin only)
- Approve or reject edit suggestions. (Admin only)



## Code Structure
The code is structured as follows:
- `app.js`: The main application file that contains the application configuration and the routes.
- `controllers`: The directory that contains the controllers for the different functionalities.
- `models`: The directory that contains the models for the different entities.
- `public`: The directory that contains the static files.
- `routes`: The directory that contains the routes for the different functionalities.
- `views`: The directory that contains the views for the different pages.


## Models
In order to store the data, the code uses the following models:
- `user`: The model that represents the user entity. This model was developed in the classes of this course, and the only change made was the addition of the `favorites` field, which is an array of acordaos that the user has marked as favorite, and the title for this relationship, and the `email` field, which is used to store the user's email.
- `acordao`: The model that represents the acordao entity. It contains all possible fields encountered in an court decision, and all of them are optional. This is to allow the user to add a court decision with only the fields that are available. This choice makes it harder to add new fields to a court decision, but it makes the application work in a smoother and faster way.
- `courts`: The model that represents the court entity.
- `requests`: The model that represents the request entity. Important to store the search criteria for a request, and it's result.
- `updates`: The model that represents the update entity. Used to store the editions made to a acordao and the suggestions made by users, whether they are approved or not.



## Endpoints

The following are the main endpoints defined in the code:

### GET /
- Description: Renders the home page.
- Middleware: None.

### GET /acordaos
- Description: Renders the acordaos page.
- Middleware: None.
- The data used in the datatable is retrieved using an ajax request to the `/acordaos/data` endpoint.

### GET /acordao/:id
- Description: Renders the acordao details page for a specific acordao.
- Middleware: None.

### GET /acordaos/filter
- Description: Renders the acordaos page with filtering based on court category.
- Middleware: None.

### GET /personal-menu
- Description: Renders the personal menu page.
- Middleware: None.

### GET /protegida
- Description: Renders the protected page.
- Middleware: `verificaAutenticacao` - middleware to verify if the user is authenticated.

### GET /favorites
- Description: Renders the favorites page.
- Middleware: `verificaAutenticacao` - middleware to verify if the user is authenticated.

### GET /search
- Description: Renders the search page.
- Middleware: `verificaAutenticacao` - middleware to verify if the user is authenticated.

### GET /search/results
- Description: Renders the search in progress page and triggers a search for acordaos based on the provided search criteria.
- Middleware: `verificaAutenticacao` - middleware to verify if the user is authenticated.

### GET /requests
- Description: Renders the user requests page.
- Middleware: `verificaAutenticacao` - middleware to verify if the user is authenticated.

### GET /requests/:id
- Description: Renders the search results page for a specific request.
- Middleware: `verificaAutenticacao` - middleware to verify if the user is authenticated.
- The data used in the datatable is retrieved using an ajax request to the `/requests/data/:id` endpoint.

### GET /acordao/edit/:id
- Description: Renders the acordao edit page for a specific acordao.
- Middleware: `verificaAutenticacao` - middleware to verify if the user is authenticated.

### GET /acordaos/search
- Description: Renders the acordaos search results page based on a search query.
- Middleware: None.

### GET /acordaos/filter/data
- Description: Retrieves the acordaos data based on the court category

### POST /acordaos/add
- Description: Adds a new acordao to the database.
- Middleware: `verificaAutenticacao` - middleware to verify if the user is authenticated.
- Only users with admin level can add a new acordao.

### POST /acordaos/edit/:id
- Description: Edits a specific acordao.
- Middleware: `verificaAutenticacao` - middleware to verify if the user is authenticated.
- The user level is checked to determine if the user can edit the acordao or if he can only suggest an edition.

### POST /courts/add
- Description: Adds a new court to the database.
- Middleware: `verificaAutenticacao` - middleware to verify if the user is authenticated.
- Only users with admin level can add a new court.

### POST /acordaos/acceptUpdate/:id
- Description: Accepts a specific update suggestion.
- Middleware: `verificaAutenticacao` - middleware to verify if the user is authenticated.
- Only users with admin level can accept a update suggestion.

### POST /acordaos/rejectUpdate/:id
- Description: Rejects a specific update suggestion.
- Middleware: `verificaAutenticacao` - middleware to verify if the user is authenticated.
- Only users with admin level can reject a update suggestion.

### POST /acordaos/addFavorite/:id
- Description: Adds a specific acordao to the user's favorites list.
- Middleware: `verificaAutenticacao` - middleware to verify if the user is authenticated.


### POST /acordaos/removeFavorite/:id
- Description: Removes a specific acordao from the user's favorites list.
- Middleware: `verificaAutenticacao` - middleware to verify if the user is authenticated.

### Methods used to deal with the user authentication
The methods used to deal with the user authentication were developed in the classes of this course, and they are the following:
- `GET /login`: Renders the login page.
- `POST /login`: Logs the user in.
- `GET /logout`: Logs the user out.
- `GET /register`: Renders the register page.
- `POST /register`: Registers a new user.


## Views
Using the endpoints defined above, the code renders generic views for some pages, but others use general code that can fit different pages. This allowed to code reduction, and to make the code more readable and maintainable.
The `acordaosStatic` view is used to render a static version of the `acordaos` page, in which the datatable is received as a parameter, instead of being generated in the view, and it's values being obtained from the server, whith a `ajax` request.
The `editAcordao` view is used to render the edit page or the suggest page for a specific acordao, and it's fields are generated dynamically, based on the acordao object received as a parameter.
The `acordao` view is used to render the details page for a specific acordao, taking into account the fields that are available for that acordao. This view is used everytime the user wants to see the details of an court decision, and contains information about whether the court decision is in the user's favorites list, and it's marker title.
Other views were developed to render specific parts of the application, and due to it's specificity, they could not be used in other pages.


## Optimizations
Through the development of this project, some optimizations were made to improve the performance of the application. As we developed the application, we noticed that the result of listing all the acordaos was taking a long time, because the web browser could not load all this information at the same time, so we decided to create a view with an empty table, and then load the data using ajax. This way, the browser only loads the data that is displayed on the screen, and the rest is loaded when the user changes the page. This optimization was also applied to the results of the search by fields.

The courts lits was also optimized, initially the list was static, and there was not possible to ass any court rule of any onther institution, however, we decided to store this information in the database, which allowed to add new courts to the list, making the apllication more interactive and with a better filling of the portuguese court decisions.
Another important optimization was to put the field's search to work in backgroud, so that the user can continue to use the application while the search is being made. The applications loads the `searchInProgress` view, with informations for the user, letting him know that the search is being made, and then, when the search is finished, the user receives an email with a link to the results and the results become available in the `requests` page. This results are stored 7 days in the database, and then are deleted, in order to remove data that could be no longer needed.

The `Redis` from `ioredis` was used to store values in cache, such as the total number of court decidions, because this query was taking too much time to be done when every oage of the datatable with the courte deciosions was loaded.For each court, the numer of court decisions was also saved in there, to make the search by court faster. The taxonomy was one of the most important optimizations, because it was taking too much time to be loaded, so we decided to save all descriptors in cache, and the id's of the courts decions with that descriptor, and then, when the user wants to see the taxonomy or the cort decisions related to that descriptor, the application checks if this value is in cache, and if it is, it is loaded from there, otherwise, it is loaded from the database. All items in cache have a time to live of 24 hours, so that the information is always updated, but every time some court decision is added, the cache is updated, in order to keep the information as updated as possible.


# Authors
[João Carvalho PG50496](https://github.com/joaoca93166)
[Vasco Matos PG50796](https://github.com/vasco1m)
