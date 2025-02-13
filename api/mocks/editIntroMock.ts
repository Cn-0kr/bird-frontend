import type { BaseResponse, IntroResponse } from '../types/response';

export const introMock: BaseResponse<IntroResponse> = {
  code: 1,
  msg: "success",
  data: {
    intro: "热爱自然，记录生活中的每一只小鸟"
  }
};