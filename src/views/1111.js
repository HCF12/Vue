val('temp.eventname', R.temp.sw_failure_report_unit_u + R.temp.waterworks_u + R.temp.sw_dnxxx_u + '[应急事件]');
val('temp.description', R.temp.sw_content_u + '[应急事件]');

//故障类型
if (R.temp.sw_fault_type_u == '49C6AD') {
    val('temp.fault_type_desc', '爆管');
} else if (R.temp.sw_fault_type_u == '36C22C') {
    val('temp.fault_type_desc', '漏水');
} else if (R.temp.sw_fault_type_u == 'B0F9C6') {
    val('temp.fault_type_desc', '渗漏');
} else if (R.temp.sw_fault_type_u == '6493DF') {
    val('temp.fault_type_desc', '阀门故障');
} else if (R.temp.sw_fault_type_u == 'ABEE27') {
    val('temp.fault_type_desc', '泵房故障');
} else if (R.temp.sw_fault_type_u == '0D1F65') {
    val('temp.fault_type_desc', '配件维修');
} else if (R.temp.sw_fault_type_u == '9FA037') {
    val('temp.fault_type_desc', '脱落/断裂');
} else if (R.temp.sw_fault_type_u == '9FA038') {
    val('temp.fault_type_desc', '鸣叫/异响');
} else if (R.temp.sw_fault_type_u == '9FA039') {
    val('temp.fault_type_desc', '其他');
}
// 故障报告单位
if (R.temp.sw_failure_report_unit_u == 'D72224') {
    val('temp.failure_report_unit_desc', '罗湖分公司');
} else if (R.temp.sw_failure_report_unit_u == 'CBB85D') {
    val('temp.failure_report_unit_desc', '福田分公司');
} else if (R.temp.sw_failure_report_unit_u == '56C587') {
    val('temp.failure_report_unit_desc', '盐田分公司');
} else if (R.temp.sw_failure_report_unit_u == '3BCF3E') {
    val('temp.failure_report_unit_desc', '南山分公司');
} else if (R.temp.sw_failure_report_unit_u == 'A0B3A8') {
    val('temp.failure_report_unit_desc', '前海分公司');
} else if (R.temp.sw_failure_report_unit_u == '1FF39C') {
    val('temp.failure_report_unit_desc', '莲塘供水公司');
} else if (R.temp.sw_failure_report_unit_u == '6ECD9C') {
    val('temp.failure_report_unit_desc', '阀门分公司');
} else if (R.temp.sw_failure_report_unit_u == 'B2B7BD') {
    val('temp.failure_report_unit_desc', '泵站分公司');
} else if (R.temp.sw_failure_report_unit_u == 'D574D3') {
    val('temp.failure_report_unit_desc', '龙华管网');
} else if (R.temp.sw_failure_report_unit_u == '6F239A') {
    val('temp.failure_report_unit_desc', '观澜管网');
} else if (R.temp.sw_failure_report_unit_u == 'D01831') {
    val('temp.failure_report_unit_desc', '布龙管网');
} else if (R.temp.sw_failure_report_unit_u == '639E0B') {
    val('temp.failure_report_unit_desc', '宝城分公司');
} else if (R.temp.sw_failure_report_unit_u == '5FFF27') {
    val('temp.failure_report_unit_desc', '福永水司');
} else if (R.temp.sw_failure_report_unit_u == '4782C3') {
    val('temp.failure_report_unit_desc', '石岩水司');
} else if (R.temp.sw_failure_report_unit_u == 'E94FCA') {
    val('temp.failure_report_unit_desc', '松岗水司');
} else if (R.temp.sw_failure_report_unit_u == '9DEDA5') {
    val('temp.failure_report_unit_desc', '沙井水司');
} else if (R.temp.sw_failure_report_unit_u == '3BA3E0') {
    val('temp.failure_report_unit_desc', '龙城分公司');
} else if (R.temp.sw_failure_report_unit_u == '7793D1') {
    val('temp.failure_report_unit_desc', '横岗水司');
} else if (R.temp.sw_failure_report_unit_u == '420DB9') {
    val('temp.failure_report_unit_desc', '平湖水司');
} else if (R.temp.sw_failure_report_unit_u == 'E9263D') {
    val('temp.failure_report_unit_desc', '坪山水司');
} else if (R.temp.sw_failure_report_unit_u == 'EA043E') {
    val('temp.failure_report_unit_desc', '坑梓水司');
} else if (R.temp.sw_failure_report_unit_u == 'FDFF8C') {
    val('temp.failure_report_unit_desc', '大鹏新区水司');
} else if (R.temp.sw_failure_report_unit_u == 'AB6C91') {
    val('temp.failure_report_unit_desc', '公明南所');
} else if (R.temp.sw_failure_report_unit_u == 'B840A3') {
    val('temp.failure_report_unit_desc', '马田所');
} else if (R.temp.sw_failure_report_unit_u == '5AD263') {
    val('temp.failure_report_unit_desc', '公明北所');
} else if (R.temp.sw_failure_report_unit_u == 'E342F0') {
    val('temp.failure_report_unit_desc', '玉塘所');
} else if (R.temp.sw_failure_report_unit_u == 'AF8DF6') {
    val('temp.failure_report_unit_desc', '光明所');
} else if (R.temp.sw_failure_report_unit_u == '2E57DF') {
    val('temp.failure_report_unit_desc', '凤凰所');
} else if (R.temp.sw_failure_report_unit_u == 'C1206C') {
    val('temp.failure_report_unit_desc', '新湖所');
} else if (R.temp.sw_failure_report_unit_u == 'D520SD') {
    val('temp.failure_report_unit_desc', '南澳水司');
} else if (R.temp.sw_failure_report_unit_u == 'D1314A') {
    val('temp.failure_report_unit_desc', '坪地水司');
} else if (R.temp.sw_failure_report_unit_u == '639EBB') {
    val('temp.failure_report_unit_desc', '新安分公司');
}

//是否修复
if (R.temp.repair_u == 'A00001') {
    val('temp.repair_flag', 1);
} else if (R.temp.repair_u == 'A00002') {
    val('temp.repair_flag', 0);
}

//是否影响交通
if (R.temp.inftraffic_u == '是') {
    val('temp.inftraffic_flag', 1);
} else {
    val('temp.inftraffic_flag', 0);
}

//是否发送短信
if (R.temp.sendsms_u == '是') {
    val('temp.sms_flag', 1);
} else {
    val('temp.sms_flag', 0);
}