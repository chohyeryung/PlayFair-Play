let alphabetBoard = Array.from(Array(5), () => new Array(5).fill(""));  //5x5 암호판을 담을 배열 변수 alphabetBoard 선언
let temp = Array.from(Array(5), () => new Array(5).fill(""));   //빈 input을 포함한 5x5 암호판을 담을 배열 변수 temp 선언
let oddFlag = false;    //홀수일 경우 x를 추가해주기 위한 변수
let zCheck = "";    //z 여부를 체크하기 위한 변수
let randomIndex1 = 0;   //공백으로 설정할 row 인덱스 변수
let randomIndex2 = 0;   //공백으로 설정한 column 인덱스 변수
let sub_dec = "";   //매핑한 문자열을 담을 변수
let enc = "";
let dec = "";

document.onkeydown = noEvent;   

function noEvent() {    //F5키 (새로고침)을 막는 함수
    if (event.keyCode == 116) {
        event.keyCode= 2;
        return false;
    }
    else if(event.ctrlKey && (event.keyCode==78 || event.keyCode == 82))
    {
        return false;
    }
}

window.onload = function() {    //웹 문서를 불러올 때
    document.getElementById("answer").style.visibility = "hidden";  //5x5 테이블이 아직 생성되지 않았으므로, 입력 버튼도 보이지 않게 한다.
    let remain = 200;    //남은 시간 세팅 : 30초
    let timer = document.getElementById("timer");   //시간을 나타낼 변수
    let x = setInterval(function() {    //일정한 간격으로 함수를 실행하기 위해 setInterval 사용
        timer.innerHTML = remain;   //초를 나타냄
        remain--;   //초가 1초씩 감소
        if(remain<0) {  //초가 0초가 되면 timeout 페이지로 이동
            location.href = "timeout.html";
        }
    }, 1000);   //1초마다 실행
}

function handleSubmit() {   //암호키와 평문을 입력 후 입력 버튼을 클릭했을 때 실행되는 함수
    let blankCheck = "";    //공백을 체크하기 위한 변수
    var key = document.getElementById("key").value; //암호키 값을 받아옴
    var sentence = document.getElementById("sentence").value;   //평문 값을 받아옴

    if(!key || !sentence) { //만약 암호키와 평문을 입력하지 않았다면
        alert("암호키와 평문을 모두 입력해주세요"); //alert문 실행
        return; //후 빠져나감
    } 

    if(!(typeof key === "string")) {
        alert("암호키는 영문을 입력해주세요"); //alert문 실행
        return; //후 빠져나감
    }

    if(!(typeof key === "string")) {
        alert("평문은 영문을 입력해주세요"); //alert문 실행
        return; //후 빠져나감
    }

    setBoard(key, sentence);    //5x5 테이블 생성하기 위한 setBoard 함수

    for( let i = 0 ; i < sentence.length ; i++ ) {
        if(sentence.charAt(i)==' ') //공백제거
        {
            sentence = sentence.substring(0,i)+sentence.substring(i+1,sentence.length); //공백이 있기 전과 그 후부터 끝까지 다시 넣어줌 (공백이 제거됨)
            blankCheck+=10; //공백 체크 변수 10 증가
        }
        else
        {
            blankCheck+=0;  //공백이 없으면 증가 x
        }
        if(sentence.charAt(i)=='z') //z가 있다면
        {
            sentence = sentence.substring(0,i)+'q'+sentence.substring(i+1,sentence.length); //z를 q로 바꿈
            zCheck+=1;  //z 체크 변수 1 증가
        }
        else 
        {
            zCheck+=0;  //z가 없다면 증가 x
        }
    }

    enc = strEncryption(sentence, alphabetBoard);   //enc 변수에 암호화 결과가 넣어짐
    document.getElementById("encryption").innerText = '암호문 : '+enc;  //encryption이라는 태그 아이디에 enc 설정

    for( let i = 0 ; i < enc.length ; i++ ) {
        if(enc.charAt(i)==' ') //공백제거
            enc = enc.substring(0,i)+enc.substring(i+1,enc.length); //암호화된 값을 공백제거 -> 복호화해야하기 때
    }

    document.getElementById("sub_dec").innerText = sub_dec; //sub_dec이라는 태그 아이디에 sub_dec 설정
}

function handleDecSubmit() {
    let blankCheck = "";    //공백을 체크하기 위한 변수
    var key = document.getElementById("key").value; //암호키 값을 받아옴
    var sentence = document.getElementById("sentence").value;   //평문 값을 받아옴

    if(!key || !sentence) { //만약 암호키와 평문을 입력하지 않았다면
        alert("암호키와 평문을 모두 입력해주세요"); //alert문 실행
        return; //후 빠져나감
    } 

    if(typeof key != "string") {
        alert("암호키는 영문을 입력해주세요"); //alert문 실행
        return; //후 빠져나감
    }

    if(typeof sentence != "string") {
        alert("평문은 영문을 입력해주세요"); //alert문 실행
        return; //후 빠져나감
    }

    for( let i = 0 ; i < sentence.length ; i++ ) {
        if(sentence.charAt(i)==' ') //공백제거
        {
            sentence = sentence.substring(0,i)+sentence.substring(i+1,sentence.length); //공백이 있기 전과 그 후부터 끝까지 다시 넣어줌 (공백이 제거됨)
            blankCheck+=10; //공백 체크 변수 10 증가
        }
        else
        {
            blankCheck+=0;  //공백이 없으면 증가 x
        }
        if(sentence.charAt(i)=='z') //z가 있다면
        {
            sentence = sentence.substring(0,i)+'q'+sentence.substring(i+1,sentence.length); //z를 q로 바꿈
            zCheck+=1;  //z 체크 변수 1 증가
        }
        else 
        {
            zCheck+=0;  //z가 없다면 증가 x
        }
    }

    dec = strDecryption(key, enc, zCheck);  //복호화 결과를 dec에 넣음
    
    for (let i = 0; i < dec.length; i++) {
        if (blankCheck.charAt(i) == "1") {
            dec = dec.substring(0, i) + " " + dec.substring(i, dec.length); //공백이 있었다면 다시 설정해줌
        }
    }
  
    
    document.getElementById("decripyion").innerText = '복호문 : '+dec;


}

function setBoard(key, sentence) {
    var keyForSet = ""; //중복된 문자가 제거된 최종 문자열 저장 변수
    var dupliFlag = false;  //암호키(key)에 중복된 문자가 있는지 체크하기 위한 변수
    var keyLengthCount = 0;

    key = key.toLowerCase();    //key가 대문자든 소문자든 소문자로 변경
    key += "abcdefghijklmnopqrstuvwxyz";    //a~z까지 차례대로 추가해야함

    for(var i=0; i<key.length; i++) {
        for(let j=0; j<keyForSet.length; j++) {
            if(key.charAt(i) === keyForSet.charAt(j)){  //원래 있던 값들과 비교해 중복이면
                dupliFlag = true;
                break;  //빠져나옴
            }
        }
        if(!(dupliFlag)) keyForSet += key.charAt(i);    //중복이 아니면 추가
        dupliFlag = false;
    }
    
    randomIndex1 = Math.floor(Math.random()*5); //0~4 인덱스 중 랜덤으로 하나 구하기
    randomIndex2 = Math.floor(Math.random()*5); //0~4 인덱스 중 랜덤으로 하나 구하기

    var tbody = document.getElementById("setTable");    //테이블 생성을 위해 body을 받아옴
    tbody.innerHTML=""; //처음 초기화

    for(let i=0; i<alphabetBoard.length; i++) {
        for(let j=0; j<alphabetBoard[i].length; j++) {
            alphabetBoard[i][j] = keyForSet.charAt(keyLengthCount++);   //완성 5x5 배열에 하나씩 대입
        }
    }

    keyLengthCount = 0; //input을 포함한 배열에도 넣어야하므로 다시 keyLengthCount를 초기화 해줌

    for(let i=0; i<temp.length; i++) {
        var tr = document.createElement("tr");  //tr 태그 생성
        for(let j=0; j<temp[i].length; j++) {
            var td = document.createElement("td");  //td 태그 생성
            td.className = 'td';    //class="td"와 같음
            temp[i][j] = keyForSet.charAt(keyLengthCount++);    //하나씩 대입
           
            if(i === randomIndex1 && j === randomIndex2) {  //만약 위에서 생성한 랜덤 위치라면
                var input = document.createElement("input");    //input 태그 생성
                input.setAttribute("id", "input");  //id="input"과 같음
                input.className = "input-con"   //class="input-con"과 같음
                td.appendChild(input);  //td 안에 input을 넣어줌 (자식으로)
            } else{
                if(temp[i][j] == 'q') {
                    temp[i][j] = 'q/z';
                }
                td.innerHTML = temp[i][j];  //td의 하나하나 안에 위에서 대입했던 temp[i][j]를 넣어줌
            }
            tr.appendChild(td); //tr 안에 td를 넣어줌 (자식으로)
        }
        tbody.appendChild(tr);  //body안에 마지막으로 tr을 넣어줌 (자식으로)
    }
    
    document.getElementById("answer").style.visibility = "visible"; //처음 숨겼던 버튼을 보이게 함 -> 5x5 테이블이 생성된 후기 때문임
}

function handleAnswer() {
    var in_answer = document.getElementById("input").value;
    if(!in_answer) {
        alert("정답을 입력해주세요😎");
        return;
    }else {
        if(alphabetBoard[randomIndex1][randomIndex2] == in_answer) {
            location.href = "success.html";
        }else {
            location.href = "fail.html";
        }
    }
    
}


function strEncryption(sentence) {  //암호화 함수
    sub_dec = "";
    sentence = sentence.toLowerCase();  //소문자로 변환
    var playFair = [];  //두개씩 묶은 데이터를 저장하는 배열
    var encPlayFair = [];
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0; //행과 열 변수 선언
    var encStr = "";    //최종 return 할 암호화 변수

    for(let i=0; i<sentence.length; i+=2) { //2개씩 묶기 위해 2씩 증가
        var tmpArr = new Array(2);
        tmpArr[0] = sentence.charAt(i);
        if(sentence.charAt(i) == sentence.charAt(i+1)) {    //첫번째와 두번째 문자가 같다면
            tmpArr[1] = 'x';    //두번째 문자를 x로 변환한 후
            i--;    //i를 1 감소 -> 다음부터는 tmpArr[1]의 값부터 다시 해야하기 때문임
        }else{
            tmpArr[1] = sentence.charAt(i+1);   //같지 않다면 원래대로 대입
        }

        //x를 설정하는 경우 -> 홀수일경우
        if(i == sentence.length-1) {    //i가 길이의-1 과 같다면 (홀수임)
            tmpArr[1] = 'x';    //x로 설정
            oddFlag = true; //홀수 변수 true로 변경
        }

        playFair.push(tmpArr);
        
    }

    for(let i=0; i<playFair.length; i++) {
        sub_dec += playFair[i][0] + ""+ playFair[i][1] + " ";   //2개씩 묶어서 sub_dec에 저장
    }

    for(let i=0; i<playFair.length; i++) {
        var tmpArr2 = new Array(2);
        for(let j=0; j<alphabetBoard.length; j++) { //각각 위치 체크
            for(let k=0; k<alphabetBoard[j].length; k++) {  //5x5 배열 변수에서
                if(alphabetBoard[j][k] === playFair[i][0]) {    //첫 번째 playFair의 값과 그 값이 같다면 
                    x1 = j; //1번 위치 설정
                    y1 = k; //1번 위치 설정
                }
                if(alphabetBoard[j][k] === playFair[i][1]) {   //두 번째 playFair의 값과 그 값이 같다면 
                    x2 = j; //2번 위치 설정
                    y2 = k; //2번 위치 설정
                }
            }
        }

        if(x1 === x2) { //행이 같은 경우
            tmpArr2[0] = alphabetBoard[x1][(y1+1)%5];   //오른쪽 문자
            tmpArr2[1] = alphabetBoard[x2][(y2+1)%5];   //오른쪽 문자
        }else if(y1 === y2) {   //열이 같은 경우
            tmpArr2[0] = alphabetBoard[(x1+1)%5][y1];  //아래쪽 문자
            tmpArr2[1] = alphabetBoard[(x2+1)%5][y2];  //아래쪽 문자
        }else { //행과 열 둘 다 다른 경우
            tmpArr2[0] = alphabetBoard[x2][y1];
            tmpArr2[1] = alphabetBoard[x1][y2];
        }
        encPlayFair.push(tmpArr2);
    }

    for(let i=0; i<encPlayFair.length; i++) {   //최종 암호화 문자열에 저장
        encStr += encPlayFair[i][0] + "" + encPlayFair[i][1] + " ";
    }

    return encStr;
}


function strDecryption(key, encryption, zCheck) {   //복호화 함수
    let playFair = new Array(); //바꾸기 전 쌍자암호를 저장할 곳
    let decPlayFair = new Array(); //바꾼 후의 쌍자암호 저장할 곳
    let x1 = 0 , x2 = 0 , y1 = 0, y2 = 0; //쌍자 암호 두 글자의 각각의 행,열 값
    let decStr ="";
    
    for( let i = 0 ; i < encryption.length ; i+=2 ) //2개씩
    {
        let tmpArr = new Array(2);
        tmpArr[0] = encryption.charAt(i);
        tmpArr[1] = encryption.charAt(i+1);
        playFair.push(tmpArr);  //playFair에 암호문을 넣어줌
    }

    
    for(let i = 0 ; i < playFair.length ; i++ ) //암호화와 반대로 해줌
    {

        let tmpArr = new Array(2);
        for( let j = 0 ; j < alphabetBoard.length ; j++ )
        {
            for( let k = 0 ; k < alphabetBoard[j].length ; k++ )
            {
                if(alphabetBoard[j][k] == playFair[i][0])   //암호화 첫 번째 값과 alphabetBoard의 값이 같다면
                {
                    x1 = j; //위치1 설정
                    y1 = k; //위치1 설정
                }
                if(alphabetBoard[j][k] == playFair[i][1])    //암호화 두 번째 값과 alphabetBoard의 값이 같다면
                {
                    x2 = j; //위치2 설정
                    y2 = k; //위치2 설정
                }
            }
        }
        
        if(x1==x2) //행이 같은 경우 각각 바로 아래열 대입
        {
            tmpArr[0] = alphabetBoard[x1][(y1+4)%5];
            tmpArr[1] = alphabetBoard[x2][(y2+4)%5];
        }
        else if(y1==y2) //열이 같은 경우 각각 바로 옆 열 대입
        {
            tmpArr[0] = alphabetBoard[(x1+4)%5][y1];
            tmpArr[1] = alphabetBoard[(x2+4)%5][y2];
        }
        else //행, 열 다른경우 각자 대각선에 있는 곳.
        {
            tmpArr[0] = alphabetBoard[x2][y1];
            tmpArr[1] = alphabetBoard[x1][y2];
        }
   
        decPlayFair.push(tmpArr);
    }
   
    for(let i = 0 ; i < decPlayFair.length ; i++) //중복 문자열 돌려놓음
    {
        if(i!=decPlayFair.length-1 && decPlayFair[i][1]=='x'    //x가 포함되면
                && decPlayFair[i][0]==decPlayFair[i][0])
        {	
            decStr += decPlayFair[i][0];    //x를 제외한 후 추가함
        }
        else
        {
            decStr += decPlayFair[i][0]+""+decPlayFair[i][1];   //아니라면 그냥 둘 다 원래대로 추가함
        }
    }
    
    
    
    for(let i = 0 ; i < zCheck.length ; i++ )//z위치 찾아서 q로 돌려놓음
    {
        if( zCheck.charAt(i) == '1' )   //z가 있었다면
            decStr = decStr.substring(0,i)+'z'+decStr.substring(i+1,decStr.length); //다시 추가해줌
        
    }
    
    if(oddFlag) decStr = decStr.substring(0,decStr.length-1);   

    
    return decStr;
}