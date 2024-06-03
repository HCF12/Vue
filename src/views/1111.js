if (!R.var.grouping_name) {
    notify('分群名称不可为空！', 'warn');
    stop();
}
if (!R.var.grouping_description) {
    notify('分群描述不可为空！', 'warn');
    stop();
}
if (R.var.label_rule.length > 0) {
    for (let i = 0; i < R.var.label_rule.ruleStructs.length; i++) {
        for (let j = 0; j < R.var.label_rule.ruleStructs.length; j++) {
            if (R.var.label_rule.ruleStructs[i].operator == '=' || R.var.label_rule.ruleStructs[i].operator == '!=' || R.var.label_rule.ruleStructs[i].operator == '>' || R.var.label_rule.ruleStructs[i].operator == '<') {
                if (R.var.label_rule.ruleStructs[i].value == undefined) {
                    notify('请填写标签规则取值！','warn');
                    stop();
                }
            }
            if (R.var.label_rule.ruleStructs[i].operator == 'range') {
                if (R.var.label_rule.ruleStructs[i].start == undefined || R.var.label_rule.ruleStructs[i].end == undefined) {
                    notify('请填写标签规则区间起始值！','warn');
                    stop();
                }
            }
        }
    }
}
if (!R.var.person_num) {
    notify('预估人数不可为空！', 'warn');
    stop();
}
if (!R.var.group_update) {
    notify('更新方式不可为空！', 'warn');
    stop();
}

if (R.var.opr === 'insert') {
    await cmd('insert');
} else {
    await cmd('update');
}
c('C397').toggle();
await cmd('reset_form');
await cmd('search');
