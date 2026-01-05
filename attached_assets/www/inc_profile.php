<?php include_once('./_common.php');
if($mode=='upPf') {
	sql_query(" update {$g5['member_table']} set mb_profile = '{$pfConTxt}' where mb_id = '{$mbId}' ");
}
	if($sect_id||$uId) {
		if($sect_id) {
			$uInfo = get_member($sectWrInfo['mb_id']);
		}
		if($uId) {
			$uInfo = get_member($uId);
		}
	} else if($mode=='upPf') {
		$uInfo = sql_fetch(" select mb_id,mb_profile from {$g5['member_table']} where mb_id = '{$mbId}' ");
	}
?>
		<div id="pfBox" class="round5">
			<div id="pfCon">
			<?php
				if($uInfo['mb_profile']) echo nl2br($uInfo['mb_profile']); //$mb_profile; //echo nl2br($mb_profile);
				else if(!$uInfo['mb_profile']&&$member['mb_id']==$uInfo['mb_id']) echo "<span class='Cccc'>".$uInfo['mb_nick']."님의 프로필을<br /><button class='btn btn-default btn-xs' id='mngPf' rel='".$uInfo['mb_id']."'>프로필 관리</button>로 올리세요.</span>";
			?>
			</div>
			<div id="pfForm" class="dispN">
				<textarea class="form-control" id="pfConTxt" rows="5"><?php echo $uInfo['mb_profile']?></textarea>
				<input id="mbId" value="<?php echo $uInfo['mb_id']?>" type="hidden" /><br />
				<button class="btn btn-warning btn-xs floL" id="undoPf"><i class="fa fa-undo"></i> 등록취소</button>
				<button class="btn btn-primary btn-xs floR" id="upPfCon"><i class="fa fa-pencil"></i> 프로필 등록</button>
			</div>
		</div>
		<?php if($member['mb_id']==$uInfo['mb_id']) { ?>
		<button class="btn btn-default btn-xs floL" id="mngPf" rel="<?php echo $uInfo['mb_id']?>">프로필 관리</button>
		<?php } ?>
