<template>
  <div class="container">
    <div class="top-block">测评进度：{{ progress }}</div>
    <!-- 菜单左右联动 -->
    <div class="menu_detail" v-if="dataList && dataList.length">
      <!-- 左侧菜单 -->
      <div class="menu_left">
        <van-sidebar v-model="tabValue">
          <van-sidebar-item
            class="sidebarItem"
            :title="item.memberName"
            v-for="(item, index) in dataList"
            :key="item.memberId"
            @click="handleDataList(index)"
          >
            <template #title>
              <van-icon name="checked" color="#44C17C" v-if="dataList[index].score.sum > 0"/>
              <van-icon name="checked" color="#B3B3B34D" v-else/>
              {{ item.memberName }}
            </template>
          </van-sidebar-item>
        </van-sidebar>
      </div>
      <!-- 右侧菜单 -->
      <div class="menu_right" id="menu_right" v-if="dataList[tabValue]">
        <div class="menu_right-item">
          <div class="itemName">测评对象：{{ dataList[tabValue].memberName }}</div>
          <el-form ref="formRef" :model="dataList[tabValue]" label-width="120px">
            <el-form-item
              v-for="(el, subIndex) in dataList[tabValue].score.list"
              :key="el.id || subIndex"
              class="Item"
              :prop="'score.list.' + subIndex + '.num'"
            >
              <template #label>
                <div class="label">
                  <span class="label-index">{{ subIndex + 1 }}</span>
                  {{ el.title }}
                </div>
              </template>
              <template v-slot>
                <div class="score-box">
                  <el-input
                    type="number"
                    v-model.number="el.num"
                    @input="calculateTotal(tabValue)"
                    :placeholder="`满分${el.max}分`"
                    class="detail-input"
                  />
                  <span>分</span>
                </div>
              </template>
            </el-form-item>
            
            <el-form-item label="总分" class="in-the-count" v-if="dataList[tabValue].score">
              <template v-slot>
                <div class="count-box">
                  <el-input
                    type="number"
                    v-model.number="dataList[tabValue].score.sum"
                    @input="handleTotalChange(tabValue)"
                    placeholder="满分100分"
                    class="total-input"
                    :class="{ 'is-error': dataList[tabValue].score.totalError }"
                  />
                  <span slot="append">分</span>
                  <div v-if="dataList[tabValue].score.totalError" class="error-message">
                    {{ dataList[tabValue].score.totalError }}
                  </div>
                </div>
              </template>
            </el-form-item>
          </el-form>
        </div>
        <div class="item-floot-box">
          <van-button class="btn" size="small" plain type="info" @click="changeScoreIndex('minus')" >
            上一个
          </van-button>
          <van-button class="btn" size="small" type="info" @click="changeScoreIndex('push')" >
            下一个
          </van-button>
        </div>
      </div>
    </div>
    <!-- 提交 submit -->
    <div class="bottomBtn" v-if="dataList && dataList.length && submitted">
      <van-button class="btn" plain type="info" @click="gobBack" >
        取 消
      </van-button>
      <van-button class="btn" type="info" @click="handleSure" >
        提 交
      </van-button>
    </div>

    <!-- 列表暂无数据 -->
    <div class="empty" v-if="!dataList.length && dataList.length < 1">
      <van-empty
        description="暂无数据"
      />
    </div>

    <van-dialog v-model="isShow" show-cancel-button :beforeClose="beforeClose">
      <div style="padding: 20px;max-height:70vh;overflow-y:auto">
        <template v-if="noPassData && noPassData.length">
          <p v-for="(item, index) in noPassData" :key="index">
            {{ item.memberName }}同志的民主测评总分为{{ item.score.sum }}分
          </p>
        </template>
        <p>请确认是否提交?</p>
      </div>
    </van-dialog>
  </div>
</template>
<script>

import { Dialog } from 'vant'
export default {
  name: "YY",
  data() {
    return {
      submitted: false,
      tabValue: 0,
      scrollNodeHeight: "360px",
      dataList: [],
      isShow: false,
      /** 动态评分项目 */
      scoringItems: [],
      noPassData: [],
      active: "",
      userInfo: {},
      mode: "auto",
      displayTotal: 0,
      isKeyboardVisible: false, // 键盘是否可见
      docHeight: window.innerHeight, // 原始窗口高度
    };
  },
  computed: {
    /** 测评进度 */
    progress() {
      const numA = this.dataList.reduce((sum,el)=> {
        if(el.score !== null && el.score.sum > 0) {
          return sum + 1
        }
        return sum
      },0)
      return `${numA}/${this.dataList.length}`
    },
    summitRule() {
      const numA = this.dataList.reduce((sum,el)=> {
        if(el.score !== null && el.score.sum > 0) {
          return sum + 1
        }
        return sum
      },0)
      return numA === this.dataList.length
    }, 
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  created() {
    // this.userInfo = this.$store.state.user.userInfo;
    this.getMemberList();
  },
  methods: {
    handleResize() {
      // 如果当前高度小于原始高度的 90%，则认为键盘已弹出
      if (window.innerHeight < this.docHeight * 0.9) {
        this.isKeyboardVisible = true;
      } else {
        this.isKeyboardVisible = false;
      }
    },
    /** 序列变换 */
    changeScoreIndex(type) {
      const num = this.dataList.length - 1
      if(type === 'push') {
        if(this.tabValue >= num) {
          this.tabValue = 0;
        }else {
          this.tabValue += 1;
        }
      }else if(type === 'minus') {
        if(this.tabValue <= 0) {
          this.tabValue = num;
        }else {
          this.tabValue -= 1;
        }
      }
    },
    calculateTotal(groupIndex) {
      const group = this.dataList[groupIndex]['score'];
      if (group.isTotalChanging) {
        return;
      }
      this.dataList[groupIndex].score.list.forEach((item, index)=> {
        const { num, max } = item
        if(num > max) {
          this.dataList[groupIndex].score.list[index].num = max;
        }
      })
      const isGroupNull = group.list.filter(({num})=> num === null || num === undefined || num === '');
      let sum = 0;
      if(isGroupNull.length < 1) {
        sum = group.list.reduce((acc, item) => {
          const val = Number(item.num) || 0;
          return acc + (isNaN(val) ? 0 : val);
        }, 0);
      }
      this.$set(group, 'sum', sum || 0);
    },
    handleTotalChange(groupIndex) {
      const group = this.dataList[groupIndex]['score'];
      if(group.sum > 100) {
        this.dataList[groupIndex].score.sum = 100
      }
      // 清除错误信息
      group.totalError = "";
      group.isTotalChanging = true;
      this.$nextTick(() => {
        group.list.forEach(item => {
          item.num = null;
        });
        group.isTotalChanging = false;
      });
    },
    // 获取党员列表
    getMemberList() {
      // memberList({
      //   democraticId: this.$route.query.id
      // }).then(res => {
      let res = {
        data: {
  "msg": "查询成功",
  "titls": "[{\"label\":\"坚定信念\"},{\"label\":\"带头攻坚克难\"},{\"label\":\"创造优良业绩\"},{\"label\":\"主动提升能力\"},{\"label\":\"严守纪律作风\"}]",
  "code": 200,
  "data": {
    "_id": null,
    "actionType": null,
    "idList": null,
    "pageNo": 1,
    "pageSize": 20,
    "sortFieldName": null,
    "sortType": "",
    "primaryName": "ID",
    "sortNames": [],
    "sortTypes": [],
    "sortFields": [],
    "cascadeSubQueryResult": null,
    "cascadeSubQueryCondition": null,
    "id": "D82FB0FDC43F40C8B4B144D4C30F75C4",
    "creatorId": "SuperAdmin",
    "createTime": 1772121600000,
    "updateTime": null,
    "updatorId": null,
    "deleteFlag": 0,
    "remark": null,
    "status": 0,
    "meetingId": "B339411E94EB4B51AFB019B8C2494EFF",
    "meetingTopic": "",
    "fileId": "0CBA92E386C3411EB6C24D306A7C36FC",
    "democraticId": "2029872C755945A9B40DFD40EEE3D8F1",
    "democraticMemberPersonList": [
      {
        "_id": null,
        "actionType": null,
        "idList": null,
        "pageNo": 1,
        "pageSize": 20,
        "sortFieldName": null,
        "sortType": "",
        "primaryName": "ID",
        "sortNames": [],
        "sortTypes": [],
        "sortFields": [],
        "cascadeSubQueryResult": null,
        "cascadeSubQueryCondition": null,
        "id": "E260072C536F478985EA57CBA1B1DD54",
        "creatorId": "SuperAdmin",
        "createTime": 1772121600000,
        "updateTime": null,
        "updatorId": null,
        "deleteFlag": 0,
        "status": null,
        "employeeId": "ceshirenyuan0016",
        "employeeName": "测试人员0016",
        "political": "01",
        "isJoin": 0,
        "partyId": "95EFD70D18594CEFA6E28175AC7B940B",
        "democraticId": "2029872C755945A9B40DFD40EEE3D8F1",
        "sex": null,
        "a0138": null,
        "a0184": null,
        "memberId": "member_id_z90",
        "democraticEvId": "9C10FF27418C450AA5E6B835963198DD",
        "customId": "7ACE01A757304DA5A344C155750267D3",
        "orgName": null,
        "deptName": null,
        "orgIdList": null,
        "unitName": null,
        "primaryValue": "E260072C536F478985EA57CBA1B1DD54"
      },
      {
        "_id": null,
        "actionType": null,
        "idList": null,
        "pageNo": 1,
        "pageSize": 20,
        "sortFieldName": null,
        "sortType": "",
        "primaryName": "ID",
        "sortNames": [],
        "sortTypes": [],
        "sortFields": [],
        "cascadeSubQueryResult": null,
        "cascadeSubQueryCondition": null,
        "id": "D5134F6B133E4EE5B2C75962511BBC75",
        "creatorId": "SuperAdmin",
        "createTime": 1772121600000,
        "updateTime": null,
        "updatorId": null,
        "deleteFlag": 0,
        "status": null,
        "employeeId": "ceshirenyuan0026",
        "employeeName": "测试人员0026",
        "political": "01",
        "isJoin": 0,
        "partyId": "95EFD70D18594CEFA6E28175AC7B940B",
        "democraticId": "2029872C755945A9B40DFD40EEE3D8F1",
        "sex": null,
        "a0138": null,
        "a0184": null,
        "memberId": "ceshirenyuan0026",
        "democraticEvId": "AD4A6101A6B44E0BB7B28E40D479878D",
        "customId": "7ACE01A757304DA5A344C155750267D3",
        "orgName": null,
        "deptName": null,
        "orgIdList": null,
        "unitName": null,
        "primaryValue": "D5134F6B133E4EE5B2C75962511BBC75"
      }
    ],
    "democraticDevelopPersonList": [],
    "democraticMassesPersonList": null,
    "flowStepCode": null,
    "flowStepName": null,
    "isSave": null,
    "meetingInfo": {
      "_id": null,
      "actionType": null,
      "idList": null,
      "pageNo": 1,
      "pageSize": 20,
      "sortFieldName": null,
      "sortType": "",
      "primaryName": "ID",
      "sortNames": [],
      "sortTypes": [],
      "sortFields": [],
      "cascadeSubQueryResult": null,
      "cascadeSubQueryCondition": null,
      "id": "B339411E94EB4B51AFB019B8C2494EFF",
      "deleteFlag": 0,
      "creatorId": "SuperAdmin",
      "createTime": 1766406481000,
      "updatorId": "172.16.53.3",
      "updateTime": 1769443200000,
      "remark": null,
      "startTime": 1769443200000,
      "endTime": 1769529600000,
      "meetingType": 1,
      "coursewareId": null,
      "partyId": "95EFD70D18594CEFA6E28175AC7B940B",
      "togetherAddress": null,
      "teachingFormatStatus": null,
      "items": null,
      "isConnection": 0,
      "partyClassLocation": "Sssssss",
      "partyCalssName": "粤卡通党支部2026年01月主题党日",
      "content": null,
      "togetherTime": 1765296000000,
      "meetingAbstract": null,
      "meetingStep": 7,
      "meetingStatus": 2,
      "isLateRecord": 0,
      "partyDayPlanId": "6A7BE231094E41C7B145081E28114904",
      "fileId": "5DFB9DA05EC043E48A00A60252BB0FA3",
      "finallyEndTime": null,
      "partyDayId": null,
      "meetingTopicsInfoList": [
        {
          "_id": null,
          "actionType": null,
          "idList": null,
          "pageNo": 1,
          "pageSize": 20,
          "sortFieldName": null,
          "sortType": "",
          "primaryName": "ID",
          "sortNames": [],
          "sortTypes": [],
          "sortFields": [],
          "cascadeSubQueryResult": null,
          "cascadeSubQueryCondition": null,
          "id": "C2B1EA077439491BAFC8F7E40C15D9A9",
          "deleteFlag": 0,
          "creatorId": "SuperAdmin",
          "createTime": 1766406481000,
          "updatorId": null,
          "updateTime": 1769494904000,
          "remark": null,
          "partyId": null,
          "meetingId": "B339411E94EB4B51AFB019B8C2494EFF",
          "topicName": "1111",
          "topicType": null,
          "isFinish": 0,
          "isPartyMeeting": 0,
          "isManage": null,
          "noAnswer": null,
          "status": 1,
          "discItemId": null,
          "partyDayId": null,
          "meetingTodoTopicList": null,
          "itemName": null,
          "meetingRecordsList": [
            {
              "_id": null,
              "actionType": null,
              "idList": null,
              "pageNo": 1,
              "pageSize": 20,
              "sortFieldName": null,
              "sortType": "",
              "primaryName": "ID",
              "sortNames": [],
              "sortTypes": [],
              "sortFields": [],
              "cascadeSubQueryResult": null,
              "cascadeSubQueryCondition": null,
              "id": "C34FE515750E44D9B40AC7AD72160D20",
              "deleteFlag": 0,
              "creatorId": "SuperAdmin",
              "createTime": 1766406481000,
              "updatorId": "SuperAdmin",
              "updateTime": 1769494904000,
              "remark": null,
              "topicsInfoId": "C2B1EA077439491BAFC8F7E40C15D9A9",
              "recordsType": 1,
              "content": "",
              "bureauCode": null,
              "primaryValue": "C34FE515750E44D9B40AC7AD72160D20"
            },
            {
              "_id": null,
              "actionType": null,
              "idList": null,
              "pageNo": 1,
              "pageSize": 20,
              "sortFieldName": null,
              "sortType": "",
              "primaryName": "ID",
              "sortNames": [],
              "sortTypes": [],
              "sortFields": [],
              "cascadeSubQueryResult": null,
              "cascadeSubQueryCondition": null,
              "id": "DD8EC759EBB148F3A7D30CE7B3903ADF",
              "deleteFlag": 0,
              "creatorId": "SuperAdmin",
              "createTime": 1766406481000,
              "updatorId": "SuperAdmin",
              "updateTime": 1769494904000,
              "remark": null,
              "topicsInfoId": "C2B1EA077439491BAFC8F7E40C15D9A9",
              "recordsType": 2,
              "content": "",
              "bureauCode": null,
              "primaryValue": "DD8EC759EBB148F3A7D30CE7B3903ADF"
            }
          ],
          "todoTopicIds": "",
          "isPartyDay": 0,
          "todoTopicIdsSingle": null,
          "orderNum": 1,
          "discItemName": null,
          "partyCourseId": null,
          "isPartyCourse": 0,
          "isMemberMeeting": 0,
          "memberMeetingId": null,
          "meetingIds": null,
          "primaryValue": "C2B1EA077439491BAFC8F7E40C15D9A9"
        }
      ],
      "meetingPersonnelList": [
        {
          "_id": null,
          "actionType": null,
          "idList": null,
          "pageNo": 1,
          "pageSize": 20,
          "sortFieldName": null,
          "sortType": "",
          "primaryName": "ID",
          "sortNames": [],
          "sortTypes": [],
          "sortFields": [],
          "cascadeSubQueryResult": null,
          "cascadeSubQueryCondition": null,
          "id": "ED82AFAEFF4E4120A7FA9825F3AEC961",
          "deleteFlag": 0,
          "creatorId": "SuperAdmin",
          "createTime": 1766406481000,
          "updatorId": null,
          "updateTime": null,
          "remark": "",
          "meetingId": "B339411E94EB4B51AFB019B8C2494EFF",
          "participantName": "测试人员0016",
          "participantType": "2",
          "memberId": "member_id_z90",
          "manualUnit": "中国共产党广东电网公司委员会",
          "manualPosition": "纪委书记,团支部委员",
          "state": 2,
          "cause": "",
          "participantTypeDto": null,
          "isSure": 1,
          "reason": "",
          "attendanceId": null,
          "partyName": "南网数字集团贵州分公司党支部",
          "postName": "团支部委员,纪委书记",
          "isFinishGoAttCount": null,
          "goingAttCount": null,
          "employeeId": "ceshirenyuan0016",
          "empStatus": "",
          "partyTeamId": null,
          "teamName": null,
          "attStateStr": null,
          "noPassCause": "",
          "passState": 0,
          "political": "01",
          "approvalInfo": null,
          "isElink": null,
          "meetingIds": null,
          "primaryValue": "ED82AFAEFF4E4120A7FA9825F3AEC961"
        },
        {
          "_id": null,
          "actionType": null,
          "idList": null,
          "pageNo": 1,
          "pageSize": 20,
          "sortFieldName": null,
          "sortType": "",
          "primaryName": "ID",
          "sortNames": [],
          "sortTypes": [],
          "sortFields": [],
          "cascadeSubQueryResult": null,
          "cascadeSubQueryCondition": null,
          "id": "D288F5C2EBB24B70A3DD526208F431E5",
          "deleteFlag": 0,
          "creatorId": "SuperAdmin",
          "createTime": 1766406481000,
          "updatorId": null,
          "updateTime": null,
          "remark": "",
          "meetingId": "B339411E94EB4B51AFB019B8C2494EFF",
          "participantName": "测试人员0026",
          "participantType": "3,4",
          "memberId": "ceshirenyuan0026",
          "manualUnit": "中共广东电网有限责任公司江门供电局委员会",
          "manualPosition": "纪委委员,纪委委员,党支部书记",
          "state": 2,
          "cause": "",
          "participantTypeDto": null,
          "isSure": 1,
          "reason": "",
          "attendanceId": null,
          "partyName": "中共广东电网有限责任公司江门供电局委员会",
          "postName": "纪委委员,党支部书记,纪委委员",
          "isFinishGoAttCount": null,
          "goingAttCount": null,
          "employeeId": "ceshirenyuan0026",
          "empStatus": "",
          "partyTeamId": null,
          "teamName": null,
          "attStateStr": null,
          "noPassCause": "",
          "passState": 0,
          "political": "01",
          "approvalInfo": null,
          "isElink": null,
          "meetingIds": null,
          "primaryValue": "D288F5C2EBB24B70A3DD526208F431E5"
        }
      ],
      "queryRange": null,
      "partyIds": null,
      "meetingTime": null,
      "flowCode": null,
      "partyName": "中国共产党粤卡通支部委员会",
      "startStartTime": null,
      "endStartTime": null,
      "keywords": null,
      "approrName": null,
      "approvalStaus": null,
      "apprTime": null,
      "apprRet": null,
      "partDayFileId": null,
      "partyTeamId": null,
      "teamName": null,
      "compere": null,
      "topicNames": null,
      "connPlanName": null,
      "dtoMeetingStatus": null,
      "apprCommt": null,
      "noPassCause": null,
      "employeeIds": null,
      "viewId": null,
      "viewMeetingType": null,
      "viewPartyId": null,
      "viewMeetingStatus": null,
      "d0121Types": null,
      "historyPartyQueryRange": null,
      "partyCourseId": null,
      "isPartyCourse": null,
      "isApproval": null,
      "reviewResult": null,
      "isApprovalSave": null,
      "meetingProcess": null,
      "approvalId": null,
      "isApprovalArchive": null,
      "reviewType": "1",
      "memberMeetingId": null,
      "isMemberMeeting": 0,
      "dtoMeetingStep": null,
      "orgMeetingId": null,
      "orgMeetingStep": null,
      "chNum": null,
      "ychNum": null,
      "dtoIsLateRecord": null,
      "memberId": null,
      "topicName": null,
      "topicType": null,
      "isSure": null,
      "state": null,
      "isClock": 0,
      "beforClock": "1",
      "afterClock": "1",
      "clockLocation": null,
      "longitude": null,
      "clockRange": null,
      "meetingRecordsList": null,
      "meetingRecordContent": null,
      "meetingRecord": null,
      "meetingCode": "20251222-202801-806E",
      "affirmStatus": "0",
      "pushTime": 1,
      "pushType": "1",
      "checkInStatus": "0",
      "checkInTime": 1769443140000,
      "affirmTime": 1769443140000,
      "nowTime": null,
      "cancelTodoStatus": 0,
      "checkInEndTime": 1769443260000,
      "participantType": null,
      "memberIdList": null,
      "isStudy": null,
      "loginUser": null,
      "isLook": null,
      "firstApprovalId": null,
      "meetingList": null,
      "apply": null,
      "isLeader": null,
      "remarkNew": null,
      "primaryValue": "B339411E94EB4B51AFB019B8C2494EFF"
    },
    "weightConfiguration": null,
    "primaryValue": "D82FB0FDC43F40C8B4B144D4C30F75C4"
  },
  "proportion": "[{\"name\":\"\",\"sum\":\"100\",\"label0\":20,\"label1\":20,\"label2\":10,\"label3\":30,\"label4\":20}]",
  "status": 3
}

        
      }
        const { code, data, status, ptyDemocraticEvVOS } = res.data;
        if (code !== 200) return;
        const {
          democraticMemberPersonList,
          democraticDevelopPersonList
        } = data;
        const { titls, proportion } = res.data;
        // 演示环境默认允许编辑和提交
        this.submitted = true;

        const nProportion = proportion ? JSON.parse(proportion)[0] : {};
        const nTitls = titls ? JSON.parse(titls) : [];
        const scoringItems = nTitls.map((item, index) => {
          return {
            id: index,
            title: item.label,
            max: nProportion[`label${index}`],
            num: undefined
          };
        });

        // 转换为可编辑的党员列表
        const mapList = arr => {
          if (!Array.isArray(arr)) return [];
          return arr.map(ele => {
            // 使用 JSON 序列化实现简单深拷贝，防止 $util.clone 不存在
            let list = JSON.parse(JSON.stringify(scoringItems));
            let sum = 0;
            if (ptyDemocraticEvVOS) {
              ptyDemocraticEvVOS.forEach(item => {
                if (item.memberId === ele.employeeId) {
                  const [customMark] = JSON.parse(item.customMark);
                  list = list.map((mp, i) => {
                    mp.num = customMark[`label${i}`];
                    return mp;
                  });
                  sum = customMark.sum;
                }
              });
            }
            return {
              id: ele.democraticEvId,
              partyId: this.userInfo?.ptyParty?.id || 'default_party_id',
              memberId: ele.memberId,
              employeeId: ele.employeeId,
              memberName: ele.employeeName,
              democraticId: this.$route?.query?.id || 'default_id',
              customId: ele.customId,
              score: {
                list,
                sum,
                isTotalChanging: false,
                totalError: "",
              }
            };
          });
        };

        this.dataList = [
          ...mapList(democraticMemberPersonList),
          ...mapList(democraticDevelopPersonList)
        ];
      // })
    },
    validateForm() {
      let isValid = true;
      // 检查每个组的合计是否有值
      this.dataList.forEach((group, index) => {
        if (group.score.sum === null || group.score.sum === undefined || group.score.sum === '') {
          group.score.totalError = '合计金额不能为空';
          isValid = false;
        } else if (isNaN(group.score.sum)) {
          group.score.totalError = '合计金额必须是有效数字';
          isValid = false;
        } else {
          group.score.totalError = '';
        }
      });
      return isValid;
    },
    /** 校验所有表单 */
    handleSure() {
      // 清除之前的错误信息
      // this.dataList.forEach(group=>{
      //   const group = this.dataList[groupIndex]['score'];
      // })
      this.dataList.map((data1, index)=>{
        data1.score.totalError = "";
      });
      if(!this.summitRule) {
        Dialog.alert({
          title: '提示',
          message: '需完成对所有测评对象的分数录入才可提交',
        })
        return;
      }

      // 验证表单
       if (!this.validateForm()) {
        this.$message.error('请确保所有组的合计金额都已填写');
        // 滚动到第一个有错误的合计输入框
        this.$nextTick(() => {
          const firstErrorCard = document.querySelector('.total-card .is-error');
          if (firstErrorCard) {
            firstErrorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
        return;
      }
      this.noPassData = this.dataList.filter(item => item.score.sum < 60);
      this.isShow = !this.isShow;
    },
    beforeClose(action, done) {
      if (action === "confirm") {
        this.submit();
      } else if (action === "cancel") {
        done(); //关闭
      }
    },
    submit() {
      let evaluationInfo = {
        year: "",
        date: ""
      };
      const newDataList = this.dataList.filter(ele => {
        return ele.employeeId == this.userInfo.employeeInfo.employeeId;
      })[0];
      newDataList && (evaluationInfo = newDataList);
      let currentYear = new Date().getFullYear().toString();
      let currentDate = this.$utils.parseTime(new Date(), "{y}-{m}-{d}");
      this.$set(evaluationInfo, "year", currentYear);
      this.$set(evaluationInfo, "date", currentDate);
      this.$util.setItem("setEvaluationInfo", evaluationInfo);
      this.$store.commit("setEvaluationInfo", evaluationInfo);
      // 修整数据格式
      const param = this.changeParam(this.dataList);
      savePtyDemocraticEvList({ list: param }).then(res => {
        if (res.data.code == 200) {
          this.$toast.success("提交成功");
          this.$router.push("/home");
        }
      });
    },
    /** 休整发送接口的数据 */
    changeParam(data) {
      return data.map(item => {
        const customMark = {};
        customMark.name = item.memberName;
        customMark.sum = item.score.sum;
        item.score.list.forEach(el => {
          const { num, id } = el
          customMark[`label${id}`] = num ? num : 0;
        });
        const { score, ...newItem } = item;
        return { ...newItem, customMark: JSON.stringify([customMark]) };
      });
    },
    gobBack() {
      this.$router.push("/home");
    },
    handleDataList(index) {

    },
  }
};
</script>
<style lang="less" scoped>
.container {
  position: relative;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%; /* 使用 100% 配合父级适配键盘 */
}

.top-block {
  display: flex;
  align-items: center;
  padding: 0 10px;
  justify-content: end;
  height: 46px;
  background: #fff;
  font-size: 14px;
  color: #999999;
  flex-shrink: 0;
}

.menu_detail {
  display: flex;
  box-sizing: border-box;
  margin-top: 14px;
  overflow: hidden; /* 外部不滚动 */
  flex: 1;
}

.menu_left {
  width: 100px; /* 稍微缩小左侧宽度 */
  height: 100%;
  overflow-y: auto;
  background: #f7f8fa;

  /deep/.van-sidebar {
    width: 100%;
  }

  .sidebarItem {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

/deep/.menu_right {
  overflow-y: auto; /* 右侧内容独立滚动 */
  position: relative;
  flex: 1;
  height: 100%;

  .menu_right-item {
    margin-bottom: 14px;
    background: #fff;
    padding: 10px;
    border-radius: 6px;
    
    .score-box {
      display: flex;
      align-items: center;
    }

    .count-box {
      display: flex;
      align-items: center;
    }

    .count-box-show {
      text-align: center;
      color: #333333;
      font-size: 16px;
      font-weight: 500;
    }

  }
  .item-floot-box {
    display: flex;
    gap: 10px;
    padding: 10px;
    margin-bottom: 20px;

    .btn {
      flex: 1;
    }
  }

  .Item {
    background: #ECF3FF;
    border-radius: 2px;
    padding: 0 10px;

    .label {
      display: flex;
      align-items: center;
      gap: 6px;

      .label-index {
        width: 14px;
        height: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        background: #117AF1;
        border-radius: 50%;
        color: #fff;
      }
    }

    .el-form-item__content .el-input__inner {
      height: 24px;
      line-height: 24px;
      text-align: center;
      padding: 0 6px;
    }
  }
  .in-the-count {
    display: flex;
    justify-content: center;

    .el-form-item__label {
      width: auto !important;
    }
    .el-form-item__content {
      margin-left: 0 !important;

      .count-box {
        gap: 10px;

        .total-input {
          width: 110px;
          height: 24px;
          display: flex;
          align-items: center;

          .el-input__inner {
            height: 100%;
          }
        }
      }
    }
  }
}

.itemName {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  color: #333333;
  font-size: 16px;
  font-weight: 500;
}

.bottomBtn {
   width: 100%;
   display: flex;
   justify-content: space-between;
   background: #fff;
   padding: 15px 10px;
   box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
   flex-shrink: 0; /* 禁止压缩 */
 
   .btn {
     width: 47%;
     border-radius: 6px;
   }
 }
/deep/ .van-sidebar-item--select::before {
  background-color: #fff;
}
/deep/ .van-sidebar-item {
  text-align: left;
  color: #333333;
  padding: 10px 15px;
}
/deep/ .van-sidebar-item--select,
.van-sidebar-item--select:active {
  background-color: #fff;
  color: #3875c5;
}

.empty {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  /deep/ .van-emfpty__description {
    font-size: 20px;
    font-weight: 700;
  }
}

.total-input.is-error .el-input__inner{
  border-color: #f56c6c;
}

.error-message{
  color:#f56c6c;
  font-size: 12px;
  margin-top: 8px;
  padding-left: 4px;
}

</style>