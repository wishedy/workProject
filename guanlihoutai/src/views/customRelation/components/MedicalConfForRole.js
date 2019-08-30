/**
 * 功能描述：角色和职称的对应配置
 * 使用方法：直接引用
 * 注意事项：
 * 引入来源：
 * 作用：
 * Create by wangning on  2019/3/11
 */
export default function(roleId) {
  let medicalConf = [];
  // 筛选医生时，显示所有职称为住院医师，主治医师，副主任医师，主任医师的用户；
  switch (roleId) {
    case '6':
      medicalConf = [
        {
          medicalTitle: '住院医师',
          id: '1'
        },
        {
          medicalTitle: '主治医师',
          id: '2'
        },
        {
          medicalTitle: '副主任医师',
          id: '3'
        },
        {
          medicalTitle: '主任医师',
          id: '4'
        },
        {
          medicalTitle: '医学生',
          id: '10'
        }
      ];
      break;

    // 筛选护士时，显示所有职称为护士，护师，主管护师，副主任护师，主任护师；
    //   12-护师
    //   13-主管护师
    //   14-副主任护师
    //   15-主任护师
    case '12':
      medicalConf = [
        {
          medicalTitle: '护士',
          id: '11'
        },
        {
          medicalTitle: '护师',
          id: '12'
        },
        {
          medicalTitle: '主管护师',
          id: '13'
        },
        {
          medicalTitle: '副主任护师',
          id: '14'
        },
        {
          medicalTitle: '主任护师',
          id: '15'
        }
      ];
      break;
    //  筛选医助时，显示所有医助用户
    case '13':
      medicalConf = [
        {
          medicalTitle: '医助',
          id: '16'
        }
      ];
      break;
    default:
      medicalConf = [
        {
          medicalTitle: '住院医师',
          id: '1'
        },
        {
          medicalTitle: '主治医师',
          id: '2'
        },
        {
          medicalTitle: '副主任医师',
          id: '3'
        },
        {
          medicalTitle: '主任医师',
          id: '4'
        },
        {
          medicalTitle: '医学生',
          id: '10'
        },
        {
          medicalTitle: '护士',
          id: '11'
        },
        {
          medicalTitle: '护师',
          id: '12'
        },
        {
          medicalTitle: '主管护师',
          id: '13'
        },
        {
          medicalTitle: '副主任护师',
          id: '14'
        },
        {
          medicalTitle: '主任护师',
          id: '15'
        },
        {
          medicalTitle: '医助',
          id: '16'
        }
      ];
      break;
  }
  return medicalConf;
}
