//基础相应类型
export interface BaseResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

// 个人介绍响应数据类型
export interface IntroResponse {
  intro: string;
}