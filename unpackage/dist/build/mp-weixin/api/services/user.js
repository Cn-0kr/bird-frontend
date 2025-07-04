"use strict";require("../../utils/request.js");const r=require("../mocks/editIntroMock.js");exports.UserService=class{async getIntro(){return r.introMock.data.intro}};
