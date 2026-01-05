<script type="text/javascript" src="<?php echo $plugin_url;?>/tpl/lightbox/jquery.lightbox-0.5.min.js"></script>
<link rel="stylesheet" type="text/css" href="<?php echo $plugin_url;?>/tpl/lightbox/jquery.lightbox-0.5.css" media="screen" />
<style tyle="text/css">
.gpf_picasa_list{position:relative;margin:10px auto;padding:0;list-style:none;line-height:160%;}
.gpf_picasa_list .gpf_pc_item {position:relative;display:inline-block;vertical-align:top; border:0;line-height:160%; margin:8px; padding:0;}
.gpf_picasa_list img {  margin-bottom:5px; border:1px solid silver}
.gpf_picasa_list .gpf_pc_desc{ width:100%;height:15px;padding:0; margin:5px 0 0 0 0;overflow:hidden;}
.gpf_picasa_list p.gpf_pc_desc_content{margin:0;padding:0;text-align:center;font-size:11px;color:#888;}
.gpf_picasa_list .gpf_pc_origin{text-align:center;}
.gpf_picasa_list .gpf_pc_origin .pc_img{border:1px solid #eee;}
<?php echo $css; ?>
</style>
<script type="text/javascript">
$(document).ready(function() {
	var lb_path = "<?php echo $plugin_url;?>/tpl/lightbox/";
	$('a[rel=lightbox_<?php echo $wr_id;?>_group]').lightBox({
		imageLoading:			lb_path + '/images/lightbox-ico-loading.gif',
		imageBtnPrev:			lb_path + '/images/lightbox-btn-prev.gif',
		imageBtnNext:			lb_path + '/images/lightbox-btn-next.gif',
		imageBtnClose:			lb_path + '/images/lightbox-btn-close.gif',
		imageBlank:				lb_path + '/images/lightbox-blank.gif'
	});

  var pc_wrap_width = $('.gpf_picasa_list').parent().width();
  $('.pc_img').each(function(idx, item) {
    var pw = $(item).width();
    if(pw > pc_wrap_width)
    {
      $(item).width(pc_wrap_width);
    }
  });
    
});	
</script>

<div class='gpf_picasa_list'>
<?php
for($i=0, $to=count($photo_list); $i<$to; $i++) 
{ 
	// 썸네일 이미지 및 너비 설정
  if($thumb_num != 'origin') {
    $thumb = "<img src='".$photo_list[$i][$thumb_num]."' class='pc_img'/>";
	  $thumb_width = $photo_list[$i][$thumb_num.'_width'].'px';
  } else {
    $thumb = "<img src='".$photo_list[$i]['imgurl']."' class='pc_img'/>";
	  $thumb_width = '98%';
  }
?>
  <div class='gpf_pc_item gpf_pc_<?php echo $thumb_num;?>' style="width:<?php echo $thumb_width;?>">
		<a href="<?php echo $photo_list[$i]['imgurl'];?>" target='_blank' rel='lightbox_<?php echo $wr_id;?>_group' title="<?php echo htmlspecialchars($img['summary']);?>">
			<?php echo $thumb;?>
		</a>
		<div class='gpf_pc_desc'>
			<p class='gpf_pc_desc_content'><?php echo $photo_list[$i]['summary'];?></p>
		</div>
	</div>

<? } ?>
</div>
