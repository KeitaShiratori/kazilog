interface CodeMaster {
  [key: string]: Object
}
interface Keys {
  [key: string]: string
}

export const FAMILY_REGISTRATION_MODE: CodeMaster = {
  CREATE: {
    label: '新規作成',
  },
  SEARCH: {
    label: '検索',
  },
}

export const REPEAT_TYPE: CodeMaster = {
  ONCE: {
    val: '繰り返しなし',
  },
  DAILY: {
    val: '毎日',
  },
  WEEKLY: {
    val: '毎週',
  },
}

/**
 * 指定したコードマスタを配列形式にして返す
 * @param codeMaster
 * @returns
 */
export const convertToArray = (codeMaster: CodeMaster) =>
  Object.keys(codeMaster).map((key: string, idx: number) =>
    Object.assign({ key, idx }, codeMaster[key])
  )

/**
 * 指定したコードマスタを配列形式にして返す
 * @param codeMaster
 * @returns
 */
export const convertToKeys = (codeMaster: CodeMaster) =>
  Object.keys(codeMaster).reduce((ret: Keys, key: string) => {
    ret[key] = key
    return ret
  }, {} as Keys)
