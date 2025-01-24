# Getting Started

Welcome to your new project.


# 1. Set up the *sales-commission* CAP Project

1. Create *CAP Project* from template. 
    - Give project name of your choice
    - Select Runtime. For this project it is Node.js
    - Choose which way to deploy your project. For this project it is *Cloud Foundry - MTA Deployment*
    - Add sample content to your project. For this project I selected *Minimal Sample*

2. This will create a essential structure to start the project.
    ```
    - order-management-app
        |_ app
        |_ db
        |_ srv
        |_.gitignore
        |_mta.yaml
        |_package.json
        |_README.md
    ```

3. File or Folder | Purpose
   ---------------|----------
   `app/`         | content for UI frontends goes here
   `db/`          | your domain models and data go here
   `srv/`         | your service models and code go here
   `.gitignore`.  | git ignore file
   `mta.yaml`.    | multi target application deployment descriptor
   `package.json` | project metadata and configuration
   `README.md`    | this getting started guide

4. Open a new terminal and run `cds watch`.

5. Start adding content, in [db/schema.cds](db/schema.cds). Define sales entities required for the application.

6. Define the service. I have created file - [srv/sales-service.cds](srv/sales-service.cds). 

7. Add data to the in memory database.
    ```
    cds add data 
    ```
8. Now, fill the test data. The above command will generate csv files in the [db/data](db/data) folder. You can copy that data or reuse the csv files in your project.

10. Open the mta.yaml and understand the structure of the file. You will see modules and resources. [Refer for details](https://www.sap.com/documents/2016/06/e2f618e4-757c-0010-82c7-eda71af511fa.html)

11. **You have successfully** 
    - Created a CAP project, 
    - Defined the domain models, 
    - Added service for the models and 
    - Added test data till now.

## Add standard Fiori Elements

**What are fiori elements?**
 - Fiori elements provides designs for UI patterns and out of the box floorplans for common enterprise application use cases.
 - Using annotations, one can create UI applications using OData services without JavaScript UI coding. 
 - The Fiori UI application uses MVC pattern.
 - SAP UI5 reads the metadata and the annotations of the OData service and leverages views at the application startup.

Let's start

1. Make sure the application is running and open *Command Pallete*.

2. Type **Fiori: Open Application Generator**
    - **Template Selection:** List Report Page
        - **Data Source:** Use a Local CAP Project
        - **Choose your CAP project:** sales-commision
        - **OData service:** SalesService
    - **Entity Selection**
        - **Main Entity:** Sales
        - **Navigation Entoty:** None
        - **Automatically add table columns to the list page and a section to the object page if none already exists?:** Yes
        - **Table Type:** responsive
    -  **Project Attributes**
        - **Module name:** sales
        - **Application title:** Sales-Commission
        - **Application namespace:** ns
        - **Add deployment configuration to MTA project (/home/user/projects/sales-commission/mta.yaml):** Yes
    - **DeploymentConfiguration**
        - **Please choose the target:** Cloud Foundry
        - **Destination name:** None

    Application will take some seconds to generate. You can now see **sales** folder inside **app** folder. Take time to inspect the files inside it. Check the Component.js file inside the webapp folder. It inherits logic from **sap/fe/core/AppComponent** class which is managed by SAP Fiori and provides all the necessary services required for the template to work properly.
3. Refer the [package.json](package.json). You will see few scripts are added. Start the server with following command
    ```
    npm run watch-sales
    ```
    
    **OR**

4. You can also type **Fiori: Open Application Info** from command pallete and click on **Preview Application**. This will start the application and you can see UI with list of sales.

5. Now start configuring the list view. From the application info page, you can click on **Open Page Map**.
I am not detailing each and every step. For quick reference you can refer step 4  of this [Configuring List View](https://developers.sap.com/tutorials/add-fiori-elements-uis.html#0180ca2a-11d5-4d49-91bf-3dbb3a3347df)

6. Now start configuring the detail page. From the application info page, you can click on **Open Page Map**.
I am not detailing each and every step. For quick reference you can refer step 5  of this [Configuring Object Page View](https://developers.sap.com/tutorials/add-fiori-elements-uis.html#9f8b34a1-68f8-41fa-af2a-2cf74428a909)

7. Let us add some custom logic to calculate the total sale price using sale price and quantity and save it in the sales table.
    - Create sales-service.js inside srv folder.
    - I have added event handlers for validations and updating commission.
    - Take a look [srv/sales-service.js](srv/sales-service.js)

8. **You have successfully** 
    - Created a standard FIORI UI web app
    - Created sales list report page and sales detail page, 
    - Enabled Create and Edit functionality. 
    - Added custom event handlers


## Add Authorization on local

1. Let us start my adding manager service and added annotations for role based access control.
    ```
    /**
     * Service used by sales manager to approve sale and commision.
     */

    service SalesManagerService {

        @title: 'Sales Transactions'  @description: 'Stores sale detail for the sales representative with final sale price.'
        entity Sales            as projection on sales.Sales;
        @readonly
        entity Products         as projection on sales.Products;
        @readonly
        entity Customers        as projection on sales.Customers;
    }

    annotate SalesService with @(requires: 'sales_representative');

    annotate SalesManagerService with @(requires: 'sales_manager');
    ```
2. Add user for local testing. Refer [package.json](package.json). Fragment provided below
    ```
    "cds": {
    "requires": {
      "[development]": {
        "auth": {
          "kind": "mocked",
          "users": {
            "sales-rep@carfox.com":{
              "password": "admin",
              "roles": ["sales_representative"]
            },
            "sales-manager@carfox.com":{
              "password": "admin",
              "roles": ["sales_manager"]
            }
          }
        }
      }
    }
    ```
3. Add a launch page on local to mimic build work zone page - [app/launchpage.html](app/launchpage.html)

4. **You have successfully** 
    - Added authorization on local
    - Added 2 roles for sales rep and sales manager 
    - Added validation that only sales manager can approve the sales record.

# Preparation to deploy on BTP

Till now we have done an exceptional work of developing a full stack application, fixing bugs and 
refining it. But we have to make it cloud ready and eventually deploy it in production. Let us upgrade
the application to be production ready.

## Set up SAP HANA Cloud

1. Add SAP HANA Cloud client to your application. The below command will make changes to the [package.json](package.json). Check your changes in github working tree.
    ```
    cds add hana --for production
    ```
    The above command will generate files like - undeploy.json, .hdiconfig as well.
    Deployments in BTP are done using production profile by default.
    
    Start your application on local and it should be working as is. If it is not, then revisit and fix the issue.

2. Next is to configure XSUAA service for authentication and trust management. The below command will make changes to the [package.json](package.json). Check your changes in github working tree.
    ```
    cds add xsuaa --for production
    ```
    The above command will generate file - [xs-security.json](xs-security.json). The above command already will create role template and scope as per the annotations defined in the [srv/sales-service.cds](srv/sales-service.cds). Check it out.

    Start your application on local and it should be working as is. If it is not, then revisit and fix the issue.

## Learn More 

Learn more at https://cap.cloud.sap/docs/get-started/.