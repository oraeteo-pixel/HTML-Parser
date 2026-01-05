<?php
/**
 * GPF 관리자 > 플러그인 설정
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 2.0.0
 */
// board, group, site 플러그인을 선별하여 로드하기 위함
if($_REQUEST['bo_table'])
{
	define("NO_GROUP_PLUGINS", TRUE);
	define("NO_SITE_PLUGINS", TRUE);
}
else if($_REQUEST['gr_id'])
{
	define("NO_BOARD_PLUGINS", TRUE);
	define("NO_SITE_PLUGINS", TRUE);
} else {
	define("NO_GROUP_PLUGINS", TRUE);
	define("NO_BOARD_PLUGINS", TRUE);
}

include_once "_common.php";

$g5['title'] = '플러그인 설정';

$gp_scope = gp_scope();

// 스코프에 맞는 경로 (이때, 폴더가 없다면 생성됨)
$data_path = gp_data_path($gp_scope);

$gpa_page_id = str_replace('.php', '', basename(__FILE__));
include_once 'head.php';

gp_do_action('gpa_pre_setting');

$gpa_settings = array();
$gpa_settings = gp_do_filter('gpa_settings', $gpa_settings);
$gpa_settings = gp_subval_asort($gpa_settings, 'order');
?>
  <h2>플러그인 설정</h2>
  <div class="gpa_section">
    <ul>
    <?php if($bo_table) {?>
      <li>
        <a href="<?php echo G5_BBS_URL; ?>/board.php?bo_table=<?php echo $bo_table; ?>">
          <span class="gp_target"><?php echo $board['bo_subject'];?></span>
        </a> 게시판에 사용되는 플러그인 설정입니다. 
      </li>
      <li>
        이 게시판이 속한 <a href="<?php echo G5_ADMIN_URL; ?>/board_list.php?sfl=a.gr_id&stx=<?php echo $board['gr_id']; ?>">"<?php echo $group['gr_subject']; ?>" 그룹</a>의 모든 게시판에 같은 설정을 하고 싶은 경우, <a href="setting.php?gr_id=<?php echo $board['gr_id']; ?>">여기</a>를 클릭하세요.
      </li>
    <?php } else if($gr_id) { ?>
      <li><a href="<?php echo G5_ADMIN_URL; ?>/board_list.php?sfl=a.gr_id&stx=<?php echo $gr_id; ?>"><span class="gp_target"><?php echo $group['gr_subject']; ?></span></a> 그룹에 사용되는 플러그인입니다. </li>
    <?php } else { ?>
      <li><span class="gp_target">사이트 전체</span>에 적용되는 플러그인 목록입니다.</li>
    <?php } ?>
    <li>사이트 전체, 혹은 다른 그룹, 게시판에 적용할 플러그인을 설정하시려면 다음 목록에서 선택하세요. <br/>
     대상 : 
    <select name="gpa_selector" class="gpa_selector" onchange="location.href='?'+this.value;">
    <option value="">사이트 전체</option>
    <option class="head" value="">---------------</option>
    <option class="head" value="">+ 그룹</option>
    <option class="head" value="">---------------</option>
    <?php foreach($gp_groups as $row)
    {
      echo '<option class="item" value="gr_id='.$row['gr_id'].'"'.($gr_id == $row['gr_id'] ? ' selected' : '').'>'.$row['gr_subject'].' ('.$row['gr_id'].')</option>'.PHP_EOL;
    } ?>
    <option class="head" value="">---------------</option>
    <option class="head" value="">+ 게시판</option>
    <option class="head" value="">---------------</option>
    <?php foreach($gp_boards as $row) {
      echo '<option class="item" value="bo_table='.$row['bo_table'].'"'.($bo_table == $row['bo_table'] ? ' selected' : '').'>   '.$row['bo_subject'].' ('.$row['bo_table'].')</option>'.PHP_EOL;
    } ?>
    </select>
    </li>
    </ul>
  </div>

	<table class="gpa_table" cellspacing="0" cellpadding="0" border="0" width="100%">
	<thead>
	<tr>
	<th colspan="2">
    <?php if(!empty($gpa_settings)) { ?>
		<select onchange="location.href='#'+this.value; gp_check_hash();" style="float:right">
		<?php foreach($gpa_settings as $cfg) { ?>
		<option value="<?php echo $cfg['ID']; ?>"><?php echo $cfg['title']; ?></option>
		<?php } ?>
		</select>
		<?php } ?>
    &nbsp;
	</th>
	</tr>
	</thead>
	<tbody>
	<?php foreach($gpa_settings as $cfg) { ?>
	<tr>
	<th scope="row" valign="top"><a name="<?php echo $cfg['ID']; ?>" style="margin-top:-50px"></a><?php echo $cfg['title']; ?></th>
	<td>
		<?php
			if($cfg['contents']) echo 'contents : ' . $cfg['contents'];
			else if($cfg['print_contents'] && is_callable($cfg['print_contents'])) call_user_func_array($cfg['print_contents'], array());
			gp_do_action('gpa_setting_contents_'.$cfg['ID']);
		?>
	</td>
	</tr>
	<?php } // foreach ?>

	<?php
	if(empty($gpa_settings)) {
		echo '<tr><td colspan="2" style="height:100px;text-align:center;">설정할 플러그인이 없습니다.</td></tr>';
	}
	?>
	</tbody>
	</table>

<script type="text/javascript">

function gp_check_hash()
{
	if(location.hash)
	{
		var hash = location.hash.substring(1);
		var tr = $('a[name='+hash+']').parent().parent();
		tr.addClass('selected_plugin');
		setTimeout(function() { tr.removeClass('selected_plugin'); }, 1500);
	}
}
gp_check_hash();
</script>
<?php

gp_do_action('gpa_post_setting');

include_once 'tail.php';
?>
