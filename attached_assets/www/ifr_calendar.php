<?php
include_once('./_common.php');
include_once('./head.sub.php');

	$Ddata = explode('-',$Dcode);
	$year = $Ddata[0];
	$month = $Ddata[1];
	$day = $dD;
	
	if($year<1901||$year>date('Y')||($year==date('Y')&&$month>date('n'))) goto_url('./ifr_calendar.php?Dcode='.date('Y').'-'.date('n'));

$month_dayF = sql_fetch(" select * from calenda_data where cd_sy = '{$year}' and cd_sm = '{$month}' order by cd_no asc limit 0, 1 ");
$month_dayL = sql_fetch(" select * from calenda_data where cd_sy = '{$year}' and cd_sm = '{$month}' order by cd_no desc limit 0, 1 ");

$pre_year_real = $year - 1;
$nex_year_real = $year + 1;

$pre_month = $month - 1;
$pre_year = $year; //당월이 1월이 아니면 이전년도는 적용하지 않음
if($month==1) {
	$pre_month = 12; //당월이 1월이면 이전년도는 12월이 되며
	$pre_year = $year - 1; //연도는 이전년도를 적용
}
$nex_month = $month + 1;
$nex_year = $year; //당월이 12월이 아니면 이후년도는 적용하지 않음
if($month==12) {
	$nex_month = 1; //당월이 12월이면 이후년도는 1월이 되며
	$nex_year = $year + 1; //연도는 이후년도를 적용
}

$pre_month_day_sunL = sql_fetch(" select * from calenda_data where cd_sy = '{$pre_year}' and cd_sm = '{$pre_month}' and cd_week = '일' order by cd_no desc limit 0, 1 ");
$nex_month_day_satF = sql_fetch(" select * from calenda_data where cd_sy = '{$nex_year}' and cd_sm = '{$nex_month}' and cd_week = '토' order by cd_no asc limit 0, 1 ");

$first_cd_no = $month_dayF['cd_no'];
if($month_dayF['cd_week']!='일')
	$first_cd_no = $pre_month_day_sunL['cd_no'];
$last_cd_no = $month_dayL['cd_no'];
if($month_dayL['cd_week']!='토')
	$last_cd_no = $nex_month_day_satF['cd_no'];

?>
<div id='calendar-box'>
	<div id='alertBox'></div>
<table cellspacing="0" cellpadding="0" id='cal-sel-tbl' align='center'>
<tr align="center">
<td><a href="<?php echo G5_URL?>/ifr_calendar.php?Dcode=<?php echo $pre_year_real?>-<?php echo $month?>&photoId=<?php echo $photoId?>"><i class="fa fa-arrow-left"></i> </a><select name="calY" id='goY'>
	<script>
		for(y=1901; y<=<?php echo date('Y')?>; y++){
			s = "";
			if(y=='<?php echo $year?>')	s = " selected";
			document.write("<option value="+y+s+" id='<?php echo G5_URL.'/ifr_calendar.php?Dcode='?>"+y+"-<?php echo $month.'&photoId='.$photoId?>'>"+y+"</option>");
		}
	</script></select>년<?php if($year<date('Y')) { ?><a href="<?php echo G5_URL?>/ifr_calendar.php?Dcode=<?php echo $nex_year_real?>-<?php echo $month?>&photoId=<?php echo $photoId?>"><?php } ?> <i class="fa fa-arrow-right"></i></a></td>
<td><a href='<?php G5_URL?>/ifr_calendar.php?Dcode=<?php echo date('Y')?>-<?php echo date('n')?>&photoId=<?php echo $photoId?>' id='today'>오늘</a></td>
<td><a href="<?php echo G5_URL?>/ifr_calendar.php?Dcode=<?php echo $pre_year?>-<?php echo $pre_month?>&photoId=<?php echo $photoId?>"><i class="fa fa-arrow-left"></i> </a><select name="calM" id='goM'>
	<script>
	<?php
		$lastM = 12;
		if($year==date('Y')) $lastM = date('n');
	?>
		var lastM = '<?php echo $lastM?>';
		for(n=1; n<=lastM; n++){
			s = "";
			if(n=='<?php echo $month?>') s = " selected";
			document.write("<option value="+n+s+" id='<?php echo G5_URL.'/ifr_calendar.php?Dcode='.$year?>-"+n+"&photoId=<?php echo $photoId?>'>"+n+"</option>");
		}
	</script></select>월<?php if($year<date('Y')||($year==date('Y')&&$month<date('n'))) { ?><a href="<?php echo G5_URL?>/ifr_calendar.php?Dcode=<?php echo $nex_year?>-<?php echo $nex_month?>&photoId=<?php echo $photoId?>"><?php } ?> <i class="fa fa-arrow-right"></i></a></td>
</tr>
</table>

<?php
$mon_date = " select * from calenda_data where cd_no >= '{$first_cd_no}' and cd_no <= '{$last_cd_no}' order by cd_no ";
$result_date = sql_query($mon_date);
?>
<table cellspacing="1" cellpadding="0" class='cal-tbl' bgcolor='#7d7c7c' border='1' bordercolor='#aaaaaa'>
<tr><th class='bgSun'>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th class='bgSat'>토</th></tr>
<?php
for($d=0; $row_date=sql_fetch_array($result_date); $d++) {
	if($d%7==0||$d==0) echo "<tr>";
	
	$bgc[$d] = "";
	if($d%7==0) $bgc[$d] = " class='bgSun'";
	else if($d%7==6) $bgc[$d] = " class='bgSat'";
	
	$this_today[$d] = "";
	if($row_date['cd_sy']==date('Y')&&$row_date['cd_sm']==date('n')&&$row_date['cd_sd']==date('j')) $this_today[$d] = " bgToday";
	
	$none_day[$d] = "";
	if($row_date['cd_sm']!=$month) $none_day[$d] = " none-day";
	
	$N = "";
	if(($row_date['cd_sy']==date('Y')&&$row_date['cd_sm']>date('n'))||($row_date['cd_sy']==date('Y')&&$row_date['cd_sm']==date('n')&&$row_date['cd_sd']>date('j')))
		$N = "N";
	
	$cheked = "";
	if($row_date['cd_sy']==$year&&$row_date['cd_sm']==$month&&$row_date['cd_sd']==$day)
		$cheked = "<i class='fa fa-check fa-2x checked'></i>";
?>
	<td<?php echo $bgc[$d]?>>
		<div class='day-wrap<?php echo $N?>' id='<?php echo $row_date['cd_sy'].'-'.$row_date['cd_sm'].'-'.$row_date['cd_sd']?>' rel='<?php echo $photoId?>'>
			<span class='each-day<?php echo $this_today[$d].$none_day[$d]?>'><?php echo $row_date['cd_sd']?></span>
	<?php
		echo "<span class='jeolgi-info'>".$row_date['cd_kterms']."</span>";
		echo $cheked;
	?>
		</div>
	</td>
<?php } ?>
</table>

</div>

<script>
////////캘린더
   $('#goY').change(function(){  
    if($("#gourl option:selected").val() != ''){  
        location.href = $("#goY option:selected").attr('id');
    }
   });  
   
    $('#goM').change(function(){  
    if($("#goM option:selected").val() != ''){  
        location.href = $("#goM option:selected").attr('id');
    }  
   });

$('.day-wrap').hover(
	function(){
		$(this).addClass('day-wrap-hover');
	},
	function(){
		$(this).removeClass('day-wrap-hover');
	}
);
$('.day-wrap').click(function(){
	var date = $(this).attr('id');
	var photoId = $(this).attr('rel');
	$('#photoDate-'+photoId,parent.document).val(date).click();
});
$('.day-wrapN').click(function(){
	$('#alertBox').fadeIn().html('오늘 이후 날짜는<br />선택이 되지 않습니다.').fadeOut(3000);
});
</script>

<?php
include_once('./tail.sub.php');
?>