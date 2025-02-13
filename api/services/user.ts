import { request } from '@/utils/request';
import type { BaseResponse, IntroResponse } from '../types/response';
import { NODE_ENV, ENV} from '@/utils/consts';
import { introMock } from '../mocks/editIntroMock';

export class UserService {
  async getIntro(): Promise<string> {
    // 开发环境使用mock数据
    if (NODE_ENV === ENV.DEVELOPMENT) {
      return introMock.data.intro;
    }
    const { data } = await request<BaseResponse<IntroResponse>>('/wx/editIntro');
    return data.intro;
  }
}