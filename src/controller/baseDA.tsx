import axios from 'axios';

import { ConfigData } from '../config/config';
import { showSnackbar } from '../snackbar/snackbar';
import { ComponentStatus } from '../component-status';

const getHeaders = async () => {
  //   let timeRefresh: any = await getDataToAsyncStorage('timeRefresh');
  let timeRefresh: any = '';

  if (typeof timeRefresh === 'string') {
    timeRefresh = parseInt(timeRefresh, 10);
  }

  const now = Date.now() / 1000;
  if (timeRefresh && timeRefresh > 0 && timeRefresh <= now) {
    const res = await fetch(ConfigData.url + 'data/refreshToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // refreshToken: await getDataToAsyncStorage('refreshToken'),
        refreshToken: '',
      }),
    });
    if (res.status === 200 || res.status === 201) {
      const jsonData = await res.json();
      if (jsonData.code === 200) {
        // await saveDataToAsyncStorage('accessToken', jsonData.accessToken);
        // await saveDataToAsyncStorage(
        //   'timeRefresh',
        //   `${Date.now() / 1000 + 9 * 60}`
        // );
        return {
          //   'refreshToken': await getDataToAsyncStorage('refreshToken'),
          //   'Authorization': `Bearer ${await getDataToAsyncStorage('accessToken')}`,
          'Content-Type': 'application/json',
        };
      }
    } else {
    }
    //   } else if (await getDataToAsyncStorage('accessToken')) {
    return {
      //   'Authorization': `Bearer ${await getDataToAsyncStorage('accessToken')}`,
      'Content-Type': 'application/json',
    };
  }
  return { 'Content-Type': 'application/json' };
};

export class BaseDA {
  static post = async (
    url: string,
    options?: { headers?: { [k: string]: any }; body?: any }
  ) => {
    try {
      let _headers: { [k: string]: any } = {};
      if (options?.headers) {
        _headers = { ...(await getHeaders()), ...options.headers };
      }
      const response = await axios.post(url, options?.body, {
        headers: _headers,
      });
      console.info(
        `POST REQUEST:\n- URL: ${url}  \n- HEADER: ${JSON.stringify(options?.headers)} \n- BODY: ${JSON.stringify(options?.body)}`
      );
      // console.info(`POST RESPONSE:\n- URL: ${url} \n- CODE: ${response.status} \n - BODY: ${response.status === 200 ? JSON.stringify(response.data) : ''}`);

      if (response.status === 200) {
        const jsonData = response.data;
        return jsonData;
      } else if (response.status === 204) {
        return {
          message: 'ok',
          data: options?.body,
        };
      } else if (response.status === 401) {
        showSnackbar({
          message: 'Không có quyền truy cập',
          status: ComponentStatus.ERROR,
        });
      } else {
        const txt = response.statusText;
        showSnackbar({
          message: 'Đã có lỗi xảy ra',
          status: ComponentStatus.ERROR,
        });
        console.error('Failed to POST data:', txt);
        return null;
      }
    } catch (error) {
      showSnackbar({
        message: 'Đã có lỗi xảy ra',
        status: ComponentStatus.ERROR,
      });
      console.error('Failed to POST data:', error);
      return null;
    }
  };

  static postFile = async (
    url: string,
    options?: { headers?: { [k: string]: any }; body?: FormData }
  ) => {
    try {
      if (options?.headers) {
        options.headers['Content-Type'] = 'multipart/form-data';
      }
      console.info('POSTFILE:\n- URL: ', url);
      console.info('\n- HEADER: ', options?.headers);
      const response = await axios.post(url, options?.body, {
        headers: options?.headers ?? { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        return response.data;
      } else if (response.status === 204) {
        return {
          message: 'ok',
          data: options?.body,
        };
      } else if (response.status === 401) {
        showSnackbar({
          message: 'Không có quyền truy cập',
          status: ComponentStatus.ERROR,
        });
      } else {
        console.error('Failed to POST data:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Failed to POST data:', error);
      return null;
    }
  };

  static get = async (
    url: string,
    options?: { headers?: { [k: string]: any } }
  ) => {
    try {
      let _headers: { [k: string]: any } = {};
      if (options?.headers) {
        _headers = { ...(await getHeaders()), ...options.headers };
      }
      const response = await axios.get(url, { headers: _headers });
      console.info(
        `GET REQUEST:\n- URL: ${url} \n- HEADER: ${JSON.stringify(options?.headers)}`
      );
      console.info(
        `GET RESPONSE:\n- URL: ${url} \n- CODE: ${response.status} \n - BODY: ${response.status === 200 ? JSON.stringify(response.data) : ''}`
      );
      if (response.status === 200) {
        const jsonData = response.data;
        return jsonData;
      } else if (response.status === 401) {
        showSnackbar({
          message: 'Không có quyền truy cập',
          status: ComponentStatus.ERROR,
        });
      } else {
        const txt = response.statusText;
        showSnackbar({
          message: 'Đã có lỗi xảy ra',
          status: ComponentStatus.ERROR,
        });
        console.error('Failed to POST data:', txt);
        return null;
      }
    } catch (error) {
      showSnackbar({
        message: 'Đã có lỗi xảy ra',
        status: ComponentStatus.ERROR,
      });
      console.error('catch error to POST data:', error);
      return null;
    }
  };

  static uploadFiles = async (
    listFile: Array<{ uri: string; type: string; name: string }>
  ) => {
    listFile = [...listFile];
    // const headersObj: any = await getHeaders()
    const headersObj: any = { pid: ConfigData.pid };
    const formData = new FormData();
    listFile.forEach((e) => {
      formData.append('files', e);
    });
    const response = await BaseDA.postFile(
      ConfigData.url + 'file/uploadfiles',
      {
        headers: headersObj,
        body: formData,
      }
    );
    if (response.code === 200) {
      return response.data;
    } else {
      showSnackbar({
        message: response.message,
        status: ComponentStatus.ERROR,
      });
    }
    return null;
  };

  static getFilesInfor = async (ids: Array<string>) => {
    // const headersObj: any = await getHeaders()
    const headersObj: any = {};
    const response = await BaseDA.post(ConfigData.url + 'file/getFilesInfor', {
      headers: headersObj,
      body: { ids: ids },
    });
    return response;
  };
}
