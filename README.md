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
    - sales-commission
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
        - **OData service:** ProcessorService
    - **Entity Selection**
        - **Main Entity:** Sales
        - **Navigation Entity:** None
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

# Prepare the application for Cloud (BTP)

Till now we have done an exceptional work of developing a full stack application, fixing bugs and 
refining it. But we have to make it cloud ready and eventually deploy it in production. Let us upgrade
the application to be production ready.

## Set up SAP HANA Cloud

Add SAP HANA Cloud client to your application. The below command will make changes to the [package.json](package.json). Check your changes in github working tree.
    ```
    cds add hana --for production
    ```
    The above command will generate files like - undeploy.json, .hdiconfig as well.
    Deployments in BTP are done using production profile by default.
    
    Start your application on local and it should be working as is. If it is not, then revisit and fix the issue.

## Add XSUAA support
Next is to configure XSUAA service for authentication and trust management. The below command will make changes to the [package.json](package.json). Check your changes in github working tree.
    ```
    cds add xsuaa --for production
    ```
    The above command will generate file - [xs-security.json](xs-security.json). The above command already will create role template and scope as per the annotations defined in the [srv/sales-service.cds](srv/sales-service.cds). Check it out.

    Start your application on local and it should be working as is. If it is not, then revisit and fix the issue.

## Add HTML5 application repository
Next is to prepare the application to be part of HTML5 application repository. Obvious question is why we need this step? A quick read - [HTML5 Application Repository](https://help.sap.com/docs/btp/sap-business-technology-platform/html5-application-repository)
    ```
    cds add html5-repo
    ```
    The above command will add html5 repo related configuration in the [mta.yaml](mta.yaml). Take a look at the changes in github working tree.

## Build your application for BTP

1. Navigate to **app/incidents** and run
    ```
    npm install
    ```
2. Come back to the root of your project and test your build
    ```
    cds build --production
    ```
    There should not be any errors and your should see the last line as - **build completed in ___ ms**

3. Ensure your project is running on local and remember check in the code. You have done a lot of hard work to reach here.

4. **You have successfully**
    - Added production profile
    - Added HANA cloud client
    - Added support of XSUAA service
    - Added HTML5 application repository configuration


# Prepare for deployment on BTP

1. Before deploying your application on BTP, ensure the below pre-requisites are met. Without these the application deployment will fail
as the supporting entitlements will not be available. **NOTE: Installing the services is not in the scope of this tutorial**
    Name                                          | Plan
    -------------------------------------         |---------------
      **SAP Build Work Zone**                     | Standard Edition or Free              
      **SAP HANA Cloud**                          | hana-free
      **SAP HANA Cloud**                          | tools (Application)
      **SAP HANA Schemas & HDI Containers**       | hdi-shared
      **SAP Continuous Integration and Delivery** | free (Application)

2. All the above installations are very well provided in this [tutorial](https://developers.sap.com/tutorials/prepare-btp-cf.html#40f3498c-7a3e-4dc8-9a9c-f204c4972731). Please take time to go through it. **NOTE: Give names relevant to your application. You do not have to follow the names provided in the tutorial but adhere to naming conventions**

3. Add configuration for SAP Build WorkZone by running following command
    ```
    cds add workzone-standard
    ```
    The above command will generate destination module and resources in [mta.yaml](mta.yaml) which will be used during deployment. Take time to
    browse through the mta.yaml and understand the modules and resources. This is the crux of your application.

4. Refer [app/sales/webapp/manifest.json](app/sales/webapp/manifest.json) file. I added 3 more attriutes on top of generated *crossNavigation* section. This is how it looks like. I added  **title**, **subTitle** and **icon**. This will be shown on the application card on Build Work Zone. Remember to add title and subtitle in [app/sales/webapp/i18n/i18n.properties](app/sales/webapp/i18n/i18n.properties)
    ```
    "crossNavigation": {
      "inbounds": {
        "sales-display": {
          "semanticObject": "sales",
          "action": "display",
          "title": "{{flpTitle}}",
          "subTitle": "{{flpSubtitle}}",
          "icon": "sap-icon://crm-sales",
          "signature": {
            "parameters": {},
            "additionalParameters": "allowed"
          }
        }
      }
    }
    ```

5. Important part - Remember to remove forward **/** from the uri parameter. The dataSource URI must be relative to the base URL.
    ```
    "dataSources": {
      "mainService": {
        "uri": "odata/v4/processor/",
        "type": "OData",
        "settings": {
          "annotations": [],
          "odataVersion": "4.0"
        }
      }
      ```

6. Open [mta.yaml](mta.yaml). Update the **build-result** and **target-path** as shown in the below snippet.
    ```
    - name: sales-commission-app-deployer
    type: com.sap.application.content
    path: .
    requires:
      - name: sales-commission-html5-repo-host
        parameters:
          content-target: true
    build-parameters:
      build-result: resources/
      requires:
        - name: salescommissionsales
          artifacts:
            - sales.zip
          target-path: resources/
    ```

7. Open [mta.yaml](mta.yaml). Update the build parameters with additional command as shown below.
    ```
    build-parameters:
    before-all:
    - builder: custom
      commands:
        - npm ci
        - npx cds build --production
        - mkdir -p resources
    ```
8. Your [mta.yaml](mta.yaml) should be ready for deployment now.

# Deploy application on SAP BTP - Cloud Foundry Environment.

1. Run multi target application build
    ```
    mbt build
    ```
    For sure there will be some errors. Check the logs and try to resolve the errors. If the build is successfull, you should see **sales-commission_1.0.0.mtar** file generated in [mta_archives](mta_archives) folder.

2. Login to your sub account
    ```
    cf api <API-ENDPOINT>
    cf login --sso
    cf target -o <ORG> -s <SPACE>
    ```

3. Run the following command to deploy the tar file
    ```
    cf deploy mta_archives/sales-commission_1.0.0.mtar
    ```
    
    As per my experience, here you will encounter errors. There will be some issues in dependencies of the modules. Be patient. Read the errors
    properly and solve them one by one. Most of the issues will be in [mta.yaml](mta.yaml) Refer the mta.yaml in this repository to compare with yours.
    
4. Check if services are created properly
    ```
    cf services
    ```
5. Once the application is deployed successfully on BTP, assign roles to your user. Follow the steps mentioned in the [tutorial](https://developers.sap.com/tutorials/user-role-assignment.html)

6. To integrate your application with SAP Build Work Zone, follow the steps mentioned in the [tutorial](https://developers.sap.com/tutorials/integrate-with-work-zone.html)

### You have successfully created a full stack application and enabled it on Build Workzone on BTP.

# Let's add freestyle UI5 app to the existing project.

1. Type **Fiori: Open Application Generator**
    - **Template Selection:** Basic
        - **Data Source:** Use a Local CAP Project
        - **Choose your CAP project:** sales-commision
        - **OData service:** ManagerService
    - **Entity Selection**
        - **View Name:** App
    -  **Project Attributes**
        - **Module name:** commissionconfig
        - **Application title:** Commission-Config
        - **Application namespace:** ns
        - **Add deployment configuration to MTA project (/home/user/projects/sales-commission/mta.yaml):** Yes
    - **DeploymentConfiguration**
        - **Please choose the target:** Cloud Foundry
        - **Destination name:** sales-commission-srv-api

2. I have created an app name **commissionconfig**. This app will be used by sales manager to configure commission config.

3. Observe the folder structure and files inside the commissionconfig app. Go through each file and try to understand.
  ```
  - commissionconfig
    |_webapp
      |_controller
      |_css
      |_i18n
      |_model
      |_test
      |_view
    |_Component.js
    |_index.html
    |_manifest.json
  |_annotations.cds
  |_package.json
  |_README.md
  |_ui5.yaml
  |_xs-app.json
  ```

4. You will see App.view.xml and App.controller.js created in view and controller folder respectively. App.view.xml is the root of the application. You will see the **Shell** element which is the holder of the complete app.
  ```
  <Shell id="_IDGenAppShell">
        <App id="app"/>
  </Shell>
  ```

5. You can start adding your own views and controllers. For example as a starter, I have added Main.view.xml and Main.controller.js to display the **CommissionConfiguration**. This is the starting point of your application. 

6. Updated the launch page on local to mimic build work zone page - [app/launchpage.html](app/launchpage.html)
  ```
  "commission-config": {
                        title: 'Commission-Config',
                        description: 'Commsission Config',
                        additionalInformation: 'SAPUI5.Component=ns.commissionconfig',
                        applicationType: 'URL',
                        url: "./commissionconfig/webapp",
                        navigationMode: 'embedded'
                    }
  ```

7. Start adding custom code, new views and/or controllers and custom style.

8. Let's add this free style application to workzone.
  ```
    cds add workzone-standard
  ```

9. Go through the below files, validate the changes and understand them [NOTE: Remove if there are any web ide related dependencies added. We do not need it as we are developing in BAS]
  - [app/commissionconfig/package.json](app/commissionconfig/package.json)
  - [app/commissionconfig/ui5-deploy.yaml](app/commissionconfig/ui5-deploy.yaml)
  - [app/commissionconfig/webapp/manifest.json](app/commissionconfig/webapp/manifest.json). Below section has to be edited based on your application
  ```
  "crossNavigation": {
      "inbounds": {
        "sales-display": {
          "semanticObject": "commissionconfig",
          "action": "display",
          "title": "{{flpTitle}}",
          "icon": "sap-icon://money-bills",
          "info":"{{flpInfo}}",
          "signature": {
            "parameters": {},
            "additionalParameters": "allowed"
          }
        }
      }
  ```
  Remember to add title and subtitle in [app/sales/webapp/i18n/i18n.properties](app/sales/webapp/i18n/i18n.properties)\

10. Run build
  ```
  mbt build
  ```

11. Remember now, 2 zip files should be created inside the resource folder if the build is success.
  - sales.zip
  - commissionconfig.zip


12. Deploy application to your cloud foundry environment
  ```
  cf deploy mta_archives/sales-commission_1.0.0.mtar
  ```

13. **You have successfully created a free style UI5 application and learnt below**
  - Table to list all the commission configuration
  - Create functionality to create new commission config
  - Edit functionality to edit existing commission config.
  - Added searching, sorting and UI validations.
  - Adding custom styling
  - Integrate with local CAP OData API

# Let's extend this application by integrating it with backend OData API

## Use Case: 

1. As you know, Customer entity has relation with Addresses. 
2. You can observer it by exploring the OData URL - https:host/odata/v4/manager/Customers?$expand=addresses 
3. Let's add a scenario where a customer doesnt have an address in the database.
4. For such customers we will fetch the address from the backend OData API. (S4HANA OData API)
5. Now to support this use case, I refactored few things as mentioned below
  - I added country, addressTimeZone attribute in the Addresses entity.
    ```
    entity Addresses : managed {
    key ID        : String;
    customer      : Association to Customers;
    streetAddress : String;
    city          : String;
    postCode      : String;
    country       : String;
    addressTimeZone: String;
    }
    ```

  - I deliberately removed some addresses from the [com.commission.sales-Addresses.csv](db/data/com.commission.sales-Addresses.csv). 
    Checkout the history of the file to understand the difference.

## Changes to Object Page
1. Here, let's add a form section for Customer Address.


# Troubleshooting tips

1. If you have error loading your application after deployment on BTP please compare the below files properly.
 - [mta.yaml](mta.yaml)
 - [package.json](package.json)
 - [xs-security.json](xs-security.json)
 - [xs-app.json](app/sales/xs-app.json)
 - [ui5.yaml](app/sales/ui5.yaml)
 - [ui5-deploy.yaml](app/sales/ui5-deploy.yaml)
 - [manifest.json](app/sales/webapp/manifest.json)

2. Ensure you have the role collection created and assigned to your user BTP.

3. Also, ensure you open the workzone site in an incognito mode or different browser. The reason is, we tend to do development on same browser and then open the site also in same browser. At times, the cache causes problem with authentication and app router is not able to reach the OData service.

## Learn More 

Learn more at https://cap.cloud.sap/docs/get-started/.
