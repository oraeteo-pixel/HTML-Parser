
		<?php if(!$is_member) { ?>
		<div class="txtC">
			<button class="btn btn-danger" data-toggle="modal" data-target="#loginInfo">
				<!--img src='<?php echo G5_IMG_URL?>/icon_ggplus.png' align='absmiddle'-->
				<i class="fa fa-google-plus"></i> 구글 소셜로그인
			</button>
			<button class="btn btn-warning" data-toggle="modal" data-target="#guideInfo">
				<i class="fa fa-info-circle"></i> 사이트 이용안내
			</button>
		</div>
			<?php }else{ ?>
		<div id="user-box2">
			<img src='<?php echo $gg_pf_img_url?>' width='50' id="mb-icon2" class="round5">
			<ul id="mb-info2">
				<li><?php echo $member['mb_nick']?> 님 반갑습니다.</li>
				<li>
					<a href='<?php g5_URL?>/_set/cert.php?mode=reg&w=u' class="btn btn-warning btn-sm" role="button">정보수정</a>
					<a href='<?php g5_URL?>/?mode=session_unset' class="btn btn-danger btn-sm" role="button">로그아웃</a>
				</li>
			</ul>
		</div>
			<?php } ?>
