"use strict";
require("../../common/vendor.js");
const api_mocks_editIntroMock = require("../mocks/editIntroMock.js");
class UserService {
  async getIntro() {
    {
      return api_mocks_editIntroMock.introMock.data.intro;
    }
  }
}
exports.UserService = UserService;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/api/services/user.js.map
