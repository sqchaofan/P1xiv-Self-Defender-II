// ==UserScript==
// @name         Pixiv Self Defender II
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       sqchaofan
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// ==/UserScript==

var NGTAGS = ["Enter NG tags to be applied here"]
var NGTAGS_R18 = ["Enter NG tags to be applied only to R-18 illustrations here"]
var tags = [];

async function fetchJSON(URL){
    var json = {};
    await fetch(URL).then(res=>{return res.json()}).then(v=>{json=v});
    return json;
}

async function getIllustInfo(illustID){
    const apiURL = "https://www.pixiv.net/ajax/illust/"+illustID
    var json = await fetchJSON(apiURL)
    return json
}

const checkNGTags = (tags) => {
    var value = [];
    tags.forEach(tag => {
        NGTAGS.forEach(ngtag => {
            if (tag.includes(ngtag)) { value.push(tag); }
        })
    });
    if (tags.includes("R-18")) {
        console.log("R-18");
        tags.forEach(tag => {
            NGTAGS_R18.forEach(ngtag => {
                if (tag.includes(ngtag)) { value.push(tag); }
            })
        });
    }
    return value
}

function createAlert(json){
    var title = json.body.title
    var userName = json.body.userName
    var artistsIllusts = Object.keys(json.body.userIllusts)
    var tags = [];
    json.body.tags.tags.forEach(item=>(tags.push(item.tag)));

    var ngtags = checkNGTags(tags);
    console.log(ngtags);

    var text = "作者："+userName+"\nタイトル："+title+"\n\n";
    text += "タグ：\n"+tags.toString();
    if (ngtags.length>0){
        text += "\n\nNGタグ：\n"+ngtags.toString();
        document.activeElement.querySelector("img").style.filter = "blur(4px)";
        document.activeElement.querySelector("img").style.outline = "rgba(255, 128, 128, 0.5) solid 300px";
        document.activeElement.querySelector("img").style["outline-offset"] = "-300px";
    }
    window.alert(text);
}

(async function () {
    'use strict';
    var selectHref = document.activeElement.href;
    if(selectHref.startsWith("https://www.pixiv.net/artworks/")){
       tags = [];
        var illustID = selectHref.split("/")[4];
        var json = await getIllustInfo(illustID);
        createAlert(json);
    }

})();
