import React, { useEffect } from 'react';
import { View } from 'react-native';
import { ColorSkin } from './assets/skin/colors';
import { TableController } from './controller/baseController';
import { ConfigData } from './config/config';

interface Props {
  /**
   * project id on admin wini
   * */
  pid: string;
  /**
   * api link
   * */
  url: string;
  imgUrlId: string;
  children?: React.ReactNode;
}

export const WiniMobileProvider = (props: Props) => {
  ConfigData.pid = props.pid;
  ConfigData.url = props.url;
  ConfigData.imgUrlId = props.imgUrlId;

  useEffect(() => {
    const colorData = new TableController('designtoken');
    colorData.getAll().then((res) => {
      if (res.code == 200) {
        const designTokens = res.data.map((e: any) => {
          return {
            ...e,
            Value: typeof e.Value === 'string' ? JSON.parse(e.Value) : e.Value,
          };
        });
        const tokenValues = designTokens.filter((e: any) => e.Type !== 'group');
        tokenValues.forEach((element: any) => {
          ColorSkin.light[element.Name.replace('--', '').replaceAll('-', '_')] =
            element.Value?.lightMode;
          ColorSkin.dark[element.Name.replace('--', '').replaceAll('-', '_')] =
            element.Value?.darkMode;
        });
      }
    });
  }, []);

  return <View>{props.children}</View>;
};
