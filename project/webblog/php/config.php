<?php
	
	//注意在建立表单数据时需要注意设定ID字段为主键，同时勾选A_I选项 ，让其自动增长，这样录入数据才正常
	
	header('Content-Type:text/html;charset=utf-8');

	define('DB_HOST','localhost');
	define('DB_USER','root');
	define('DB_PWD','seagull');
	define('DB_NAME','blog');
	$con = mysqli_connect("localhost","root","seagull");
	if (!$con)
	  {
	  die('Could not connect: ' . mysql_error());
	  }
	mysqli_select_db($con,'blog'); 
	mysqli_query($con,"set names 'utf8'");
	$_birthday = $_POST['reg_year'].'-'.$_POST['reg_month'].'-'.$_POST['reg_day'];
	$query = "INSERT INTO blog_user(user,pass,ques,ans,email,birthday,ps)
					VALUES('{$_POST['reg_user']}',sha1('{$_POST['reg_pass']}'),'{$_POST['reg_ques']}','{$_POST['reg_ans']}','{$_POST['reg_email']}','{$_birthday}','{$_POST['reg_ps']}')";
	mysqli_query($con,"set names 'utf8'");
	mysqli_query($con,$query) or die('新增出错'.mysql.error());

	sleep(3); //模拟网络延迟
	echo mysqli_affected_rows( $con );
	
	mysqli_close($con);
				
?>