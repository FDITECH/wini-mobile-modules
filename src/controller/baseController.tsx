import { ConfigData } from '../config/config';
import { BaseDA } from './baseDA';

export class DataController {
  private pid: string;
  private module: string;
  constructor(module: string, pid?: string) {
    this.pid = pid ?? ConfigData.pid;
    this.module = module;
  }

  async getAll() {
    const res = await BaseDA.get(ConfigData.url + 'data/getAll', {
      headers: {
        module: this.module,
        pid: this.pid ?? ConfigData.pid,
      },
    });
    return res;
  }

  async aggregateList(
    options:
      | {
          page?: number;
          size?: number;
          searchRaw?: string;
          filter?: string;
          sortby?: Array<{ prop: string; direction?: 'ASC' | 'DESC' }>;
        }
      | undefined
  ) {
    const res = await BaseDA.post(ConfigData.url + 'data/aggregateList', {
      headers: {
        pid: this.pid ?? ConfigData.pid,
        module: this.module,
      },
      body: options,
    });
    return res;
  }

  async filterByEmptyKey(
    options:
      | {
          page?: number;
          size?: number;
          searchRaw?: string;
          key: string;
          sortby?: Array<{ prop: string; direction?: 'ASC' | 'DESC' }>;
        }
      | undefined
  ) {
    const res = await BaseDA.post(ConfigData.url + 'data/filterByEmptyKey', {
      headers: {
        pid: this.pid ?? ConfigData.pid,
        module: this.module,
      },
      body: options,
    });
    return res;
  }

  async group(options: { searchRaw?: string; reducers: string }) {
    const res = await BaseDA.post(ConfigData.url + 'data/group', {
      headers: {
        pid: this.pid ?? ConfigData.pid,
        module: this.module,
      },
      body: options,
    });
    return res;
  }

  async groupByIds(params: {
    reducers: Array<{
      Name: string;
      Reducer: any;
      ReducerBy?: string;
      TbName: string;
      Column: string;
    }>;
    ids: Array<string>;
  }) {
    if (params.reducers.length) {
      const groupReducers: Array<{
        tbName: string;
        query: string;
        searchRaw?: string;
      }> = [];
      const groupNames: Array<string> = [];
      for (const e of params.reducers) {
        if (!groupNames.includes(e.TbName)) {
          groupNames.push(e.TbName);
        }
      }
      for (let _tbName of groupNames) {
        const _tmp = params.reducers.filter((e) => e.TbName === _tbName);
        const _reduceQuery = _tmp
          .map(
            (e) =>
              `REDUCE ${e.Reducer} ${
                e.ReducerBy ? `1 @${e.ReducerBy}` : 0
              } AS ${e.Name}`
          )
          .join(' ');
        const _colName = _tmp[0]?.Column;
        const _groupName = `_${_colName}`;
        groupReducers.push({
          tbName: _tbName,
          searchRaw: params.ids.length
            ? `@${_colName}:{${params.ids.map((_id) => `${_id}*`).join(' | ')}}`
            : '*',
          query:
            `APPLY @${_colName} AS ${_groupName}` +
            ` GROUPBY 1 @${_groupName} ${_reduceQuery}`,
        });
      }
      const res = await BaseDA.post(ConfigData.url + 'data/groupByIds', {
        headers: { pid: this.pid ?? ConfigData.pid },
        body: {
          reducers: groupReducers,
        },
      });
      return res;
    }
    return [];
  }

  async getListSimple(
    options:
      | {
          page?: number;
          size?: number;
          query?: string;
          returns?: Array<string>;
          sortby?: { BY: string; DIRECTION?: 'ASC' | 'DESC'; ORDER?: string };
        }
      | undefined
  ) {
    const res = await BaseDA.post(ConfigData.url + 'data/getListSimple', {
      headers: {
        pid: this.pid ?? ConfigData.pid,
        module: this.module,
      },
      body: {
        searchRaw: options?.query?.length ? options?.query : '*',
        page: options?.page ?? 1,
        size: options?.size ?? 10,
        returns: options?.returns,
        sortby: options?.sortby,
      },
    });
    return res;
  }

  async getById(id: string) {
    const res = await BaseDA.post(ConfigData.url + `data/getById?id=${id}`, {
      headers: {
        pid: this.pid ?? ConfigData.pid,
        module: this.module,
      },
    });
    return res;
  }

  async getByListId(ids: Array<string>) {
    const res = await BaseDA.post(ConfigData.url + 'data/getByIds', {
      headers: {
        pid: this.pid ?? ConfigData.pid,
        module: this.module,
      },
      body: { ids: ids },
    });
    return res;
  }

  async add(data: Array<{ [p: string]: any }>) {
    const res = await BaseDA.post(ConfigData.url + 'data/action?action=add', {
      headers: {
        pid: this.pid ?? ConfigData.pid,
        module: this.module,
      },
      body: { data: data },
    });
    return res;
  }

  async edit(data: Array<{ [p: string]: any }>) {
    const res = await BaseDA.post(ConfigData.url + 'data/action?action=edit', {
      headers: {
        pid: this.pid ?? ConfigData.pid,
        module: this.module,
      },
      body: { data: data },
    });
    return res;
  }

  async delete(ids: Array<string>) {
    const res = await BaseDA.post(
      ConfigData.url + 'data/action?action=delete',
      {
        headers: {
          pid: this.pid ?? ConfigData.pid,
          module: this.module,
        },
        body: { ids: ids },
      }
    );
    return res;
  }

  async groupBy(params: {
    reducers: Array<{
      Name: string;
      Reducer: any;
      ReducerBy?: string;
      GroupBy: string;
      Query?: string;
    }>;
    searchRaw?: string;
  }) {
    const res = await BaseDA.post(ConfigData.url + 'data/groupBy', {
      headers: {
        pid: this.pid ?? ConfigData.pid,
        module: this.module,
      },
      body: params,
    });
    return res;
  }
}

export class IntergrationController {
  private pid: string;
  constructor() {
    this.pid = ConfigData.pid;
  }

  async sendMessageAll(options: {
    title?: string;
    body?: string;
    imageUrl?: string;
    type?: string;
  }) {
    await BaseDA.post(ConfigData.url + 'intergration/sendMessageAll', {
      headers: { pid: this.pid },
      body: options,
    });
  }

  async sendMessageToGroup(options: {
    customers: any;
    searchRaw?: string;
    title?: string;
    body?: string;
    imageUrl?: string;
    type?: string;
  }) {
    await BaseDA.post(ConfigData.url + 'intergration/sendMessageToGroup', {
      headers: { pid: this.pid, module: 'Customer' },
      body: options,
    });
  }

  async sendMessageToDevice(options: {
    customerId?: string;
    title?: string;
    body?: string;
    imageUrl?: string;
    type?: string;
  }) {
    var notiItem = {
      // Id: randomGID(),
      Name: options.title,
      DateCreated: Date.now(),
      // Sort: 1,
      Content: options.body,
      // Status: 0,
      // LinkWeb: "/setting/company",
      CustomerId: options.customerId,
      // ConfigNotificationId: configNotificationId,
    };
    const controller = new DataController('Notification');
    var addnoti = await controller.add([notiItem]);
    if (addnoti.code === 200) {
      await BaseDA.post(ConfigData.url + 'intergration/sendMessageToDevice', {
        headers: { pid: this.pid, module: 'Customer' },
        body: options,
      });
    }
  }
}

export class SettingDataController {
  private pid: string;
  private setting: 'model' | 'reducer' | 'chart' | 'form' | 'card';
  private type: string;
  constructor(setting: 'model' | 'reducer' | 'chart' | 'form' | 'card') {
    this.pid = ConfigData.pid;
    this.setting = setting;
    if (setting === 'model' || setting === 'reducer') {
      this.type = 'report';
    } else {
      this.type = setting;
    }
  }

  async action(
    action: 'add' | 'edit' | 'delete',
    options: { data?: Array<{ [p: string]: any }>; ids?: Array<string> }
  ) {
    const res = await BaseDA.post(
      ConfigData.url +
        `data/${
          this.type === 'report' ? `${this.type}/${this.setting}` : this.type
        }/action?action=${action}`,
      {
        headers: { pid: this.pid },
        body: { data: options.data, ids: options.ids },
      }
    );
    return res;
  }

  async getListSimple(
    options:
      | {
          page?: number;
          size?: number;
          query?: string;
          returns?: Array<string>;
          sortby?: { BY: string; DIRECTION?: 'ASC' | 'DESC' };
        }
      | undefined
  ) {
    const res = await BaseDA.post(
      ConfigData.url +
        `data/${
          this.type === 'report' ? `${this.type}/${this.setting}` : this.type
        }/getListSimple`,
      {
        headers: { pid: this.pid },
        body: {
          searchRaw: options?.query?.length ? options?.query : '*',
          page: options?.page ?? 1,
          size: options?.size ?? 10,
          returns: options?.returns,
          sortby: options?.sortby,
        },
      }
    );
    return res;
  }

  async getByIds(ids: Array<string>) {
    const res = await BaseDA.post(
      ConfigData.url +
        `data/${
          this.type === 'report' ? `${this.type}/${this.setting}` : this.type
        }/getByIds`,
      {
        headers: { pid: this.pid },
        body: { ids: ids },
      }
    );
    return res;
  }
}

export class TableController {
  private pid: string;
  private module:
    | 'table'
    | 'column'
    | 'rel'
    | 'menu'
    | 'page'
    | 'layer'
    | 'designtoken'
    | 'workflow'
    | 'stage'
    | 'settingstage';
  constructor(
    module:
      | 'table'
      | 'column'
      | 'rel'
      | 'menu'
      | 'page'
      | 'layer'
      | 'designtoken'
      | 'workflow'
      | 'stage'
      | 'settingstage'
  ) {
    this.pid = ConfigData.pid;
    this.module = module;
  }

  async getAll() {
    const res = await BaseDA.get(ConfigData.url + 'setting/getAll', {
      headers: {
        pid: this.pid,
        module: this.module,
      },
    });
    return res;
  }

  async getByListId(ids: Array<string>) {
    const res = await BaseDA.post(ConfigData.url + 'setting/getByIds', {
      headers: {
        pid: this.pid,
        module: this.module,
      },
      body: { ids: ids },
    });
    return res;
  }

  async getListSimple(options?: {
    page?: number;
    size?: number;
    query?: string;
    returns?: Array<string>;
    sortby?: { BY: string; DIRECTION?: 'ASC' | 'DESC' };
  }) {
    const res = await BaseDA.post(ConfigData.url + 'setting/getListSimple', {
      headers: {
        pid: this.pid,
        module: this.module,
      },
      body: {
        searchRaw: options?.query ?? '*',
        page: options?.page ?? 1,
        size: options?.size ?? 10,
        returns: options?.returns,
        sortby: options?.sortby,
      },
    });
    return res;
  }

  async group(options: { searchRaw?: string; reducers: string }) {
    const res = await BaseDA.post(ConfigData.url + 'setting/group', {
      headers: {
        pid: this.pid,
        module: this.module,
      },
      body: options,
    });
    return res;
  }

  // async add(data: Array<TableItem | ColumnItem | RelativeItem | MenuItem | PageItem | LayerItem | DesignTokenItem | StageItem | WorkflowItem | SettingStageItem>) {
  //     const res = await BaseDA.post(ConfigData.url + 'setting/action?action=add', {
  //         headers: {
  //             pid: this.pid,
  //             module: this.module
  //         },
  //         body: { data: data }
  //     })
  //     return res
  // }

  // async edit(data: Array<TableItem | ColumnItem | RelativeItem | MenuItem | PageItem | LayerItem | DesignTokenItem | StageItem | WorkflowItem | SettingStageItem>) {
  //     const res = await BaseDA.post(ConfigData.url + 'setting/action?action=edit', {
  //         headers: {
  //             pid: this.pid,
  //             module: this.module
  //         },
  //         body: { data: data }
  //     })
  //     return res
  // }

  async delete(ids: Array<string>) {
    const res = await BaseDA.post(
      ConfigData.url + 'setting/action?action=delete',
      {
        headers: {
          pid: this.pid,
          module: this.module,
        },
        body: { ids: ids },
      }
    );
    return res;
  }
}
