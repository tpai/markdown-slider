# *[English manual](https://github.com/tpai/markdown_slider#english-en_us)
# *[繁體中文手冊](https://github.com/tpai/markdown_slider#%E7%B9%81%E9%AB%94%E4%B8%AD%E6%96%87-zh_tw)

- - -

#English en_US

##Markdown Slider
Use [markdown](http://markdown.tw) language to create your slide efficiency. 

Features
---------
* Open your browser, then you can work.
* From begin to demo, I think it's quicker than PPT of M$.
* Font, color and animation are all set. (based on [deck.js](http://imakewebthings.com/deck.js/) under [MIT License](https://github.com/imakewebthings/deck.js/blob/master/MIT-license.txt) and [GPL License](https://github.com/imakewebthings/deck.js/blob/master/GPL-license.txt))

Better part
-----------
* No need to setup anything, also no capability problem.
* Make me focus on content of slide, no more wasting time on FCA. (font, color, animation)
* It'll become your dedicated slide server, no more carry file or virus problem.

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

- - -

#繁體中文 zh_TW

##Markdown簡報產生器
利用[markdown](http://markdown.tw)有效率的製作簡報

特色
----
* 只要打開瀏覽器馬上就可以使用。
* 字形顏色動畫全部一次到位，此處使用了[deck.js](http://imakewebthings.com/deck.js/)所提供的功能。 (基於[MIT](https://github.com/imakewebthings/deck.js/blob/master/MIT-license.txt)與[GPL](https://github.com/imakewebthings/deck.js/blob/master/GPL-license.txt)授權)
* 個人覺得從開始到可以DEMO總體速度來說是比M$的PPT快。

好處
----
* 無須安裝任何軟體或擔心相容性問題。
* 可以專注於思考簡報內容，無須費神於調整字形顏色或動畫。
* 個人的專屬簡報伺服器，再也不用攜帶檔案或擔心隨身碟中毒了。


安裝指南
--------
1. 將所有的檔案放置到www/資料夾下

2. $npm install (下載相應模組)
   * **jsdom模組需要python跟c++環境，請確認安裝完畢後再下'npm install'指令。**

3. 填寫設定值

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

4. 然後就可以node下去玩了 :)

快捷鍵
------
####儲存
* Ctrl + S

####預覽
* Ctrl + F5

####捲動
* Alt + ↑
* Alt + ↓
* Alt + Pageup
* Alt + Pagedown
