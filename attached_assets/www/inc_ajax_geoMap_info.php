<?php
include_once('./_common.php');
include_once('./head.sub.php');
?>
<div class="fs-10 ff-ng">
<strong><?php echo $sites_info['wr_subject']?></strong><br />
<a href="<?php echo G5_URL?>/_map/?map_id=<?php echo $sites_info['wr_id']?>" target="_top">상세보기</a>
</div>
<?php
include_once('./tail.sub.php');
?>