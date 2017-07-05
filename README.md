# NavWell
NavWell is a Virtual Reality framework to determine memory and spatial navigation abilities. There are three distinct parts of the software;

  - The [API](https://github.com/DiarmuidLeahy/NavWell-API "GitHub Repo") which handles all interactions with the database
  - The NavWell Administrator Console which is the interface allowing users to customize experiments and view results
  - A [Virtual Reality application](https://github.com/DiarmuidLeahy/NavWell-VR "GitHub Repo") requiring [Oculus Rift](https://www.oculus.com/rift/ "Oculus website")
  
**If you haven't already done so, you'll need to install the [NavWell API](https://github.com/DiarmuidLeahy/NavWell-API "GitHub Repo") before installing this administrator console**


## Requirements and Dependencies

### Software
The following tools are required before the installation of NavWell. Note: You may have already completed this step during the installation of the API. If so, you can skip this step.
  
  - [Ruby v2.3.3](https://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.3.3-x64.exe "2.3.3")
  - [Node.js v6.11.0](https://nodejs.org/dist/v6.11.0/node-v6.11.0-x64.msi "Latest version")
  
  
## Installing the NavWell Administrator Console

Once each of the above dependencies are installed, you're ready to download and install the NavWell Administrator Console.
Open a command prompt window and run the following commands:

  1. `git clone https://github.com/DiarmuidLeahy/NavWell-Admin-Console.git navwell/admin`
  2. `cd navwell/admin`
  3. `gem install compass`
  4. `bower install`
  5. `npm install`

## Running the service

This step assumes that you have started the database and the API as described in the API documentation:

> Start the database by opening a command prompt and navigating to `"C:\Program Files\MongoDB\Server\3.4\bin"`. From there, type
> `mongod`. If you see a message to the effect of `[thread1] waiting for connections on port 27017 `, the service is performing correctly. Leave this window open and open a new command prompt. From here, navigate to where you installed the API ("navwell/api" or similar) and run `node app`

Once the step described above is complete, start the administrator console by navigating to where the app is installed ("navwell/admin") and type:
```
grunt serve
```

NavWell is now fully installed and you can begin configuring and conducting experiments. The Virtual Reality application can be downloaded from [NavWell VR](https://github.com/DiarmuidLeahy/NavWell-VR "GitHub Repo")

