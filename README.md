#markdown slider
Use markdown language to create your slide efficiency. 
- - -

Features
---------
* Open your browser, then you can work.
* I think faster than M$ ppt, how about you?
* FCA are all set. (font & color & animation)

Better part
-----------
* **NO NEED TO SETUP ANYTHING.**
* Focus my thought, no more wasting time on FCA.
* Quick edit, quick demo!

Setup
------
1. unzip files into your www/ directory

2. $npm install
   * **jsdom module needs python and c++ runtime environment, be sure to install before run 'npm install'.**

3. fill up your settings

        //mongodb settings
        dbserver = 'db.test.com',
        dbport = 3001,
        dbname = 'test',
        dbuser = 'admin',
        dbpass = 'pass',
        collection_name = 'slides',
        
        //server settings
        svrport = 999
        
        //only known by author
        editable = auth({
          authRealm: "Do you have permit to edit this?",
          authList: ['username:password']
        }),

4. enjoy it!

Quick launch
------------
####Save
* Ctrl + S

####Preview
* Ctrl + F5

####Scroll
* Alt + ↑
* Alt + ↓
* Alt + Pageup
* Alt + Pagedown
