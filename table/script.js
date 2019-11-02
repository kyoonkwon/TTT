$("#gajung-search").click(function (e) {

    tdepart =  $("#input_depart").val();
    tgrade =  $("#input_grade").val();
    tnull =  $("#input_null").val();
    tlect =  $("#input_lecture").val();
    ttot =  $("#input_total").val();

    // request course
    $.ajax({
        type: "GET",
        url: "http://143.248.73.62:8080/ajax",
        data: {department:tdepart, grade:tgrade, free:tnull, lecture:tlect, total:ttot},
        dataType: "json",
        success: function (response) {
            
            console.log(response)
            courses = response

            // parse course
            courses.forEach(course => {
                parseCourse(course)
            });
        }
    });

    
});


/*

<div class="hour-half hour__14__30 class2">
    <div class="course">
        <div class="title">프로그래밍언어</div>
        <div class="prof">류석영</div>
        <div class="loc">E11 터만홀</div>
    </div>
</div>


인사동: 210 130
창의관: 185 180
N1: 300 120
e3: 235 220
w1: 120 250

*/

parseCourse = function(course){
    var times = course.time.split("/")
    var num = Math.ceil(Math.random() * 5)
    times.forEach(time => {
        d = time.split(" ")
        
        rtime = d[1].split("~")
        start = rtime[0].split(":")
        end = rtime[1].split(":")

        dhour = (Number(end[0]) - Number(start[0])) * 60
        dmin = Number(end[1]) - Number(start[1])
        dtime = dhour + dmin

        var $div = $(`<div class="hour-half">
        <div class="course">
            <div class="title">${course.title}</div>
            <div class="prof">${course.pro}</div>
            <div class="loc">${course.loc}</div>
        </div>`);

        $($div).addClass(`class${num}`)

        $($div).addClass(`hour__${start[0]}__${start[1]}`)

        var loc = course.loc.split("(")[1].split(")")[0]


        if(dtime == 60){
            $($div).addClass("hour--one");

            
        }

        if(dtime == 120){
            $($div).addClass("hour--two");

        }
        if(dtime == 180){
            $($div).addClass("hour--three");
        }

        if(dtime == 240){
            $($div).addClass("hour--four");
        }

        if(dtime == 300){
            $($div).addClass("hour--five");
        }

        if(d[0] === "월"){
            $(".mon").append($div);
            var t = $("#mon_route").text();
            $("#mon_route").text(t + ", "+loc);

        }
        if(d[0] === "화"){
            $(".tue").append($div);
            var t = $("#tue_route").text();
            $("#tue_route").text(t + ", "+loc);
            
        }
        if(d[0] === "수"){
            $(".wed").append($div);
            var t = $("#wed_route").text();
            $("#wed_route").text(t + ", "+loc);
            
        }
        if(d[0] === "목"){
            $(".thu").append($div);
            var t = $("#thu_route").text();
            $("#thu_route").text(t + ", "+loc);

            
        }
        if(d[0] === "금"){
            $(".fri").append($div);
            var t = $("#fri_route").text();
            $("#fri_route").text(t + ", "+loc);
   
        }
    }) 

    var exam = course.exam.split(" ")
    var div2 = `<div class="exam_info">${exam[1]} ${course.title}</div>`
    if(exam[0] === "월"){
        $("#mon_exam").append(div2);
        
    }
    if(exam[0] === "화"){
        $("#tue_exam").append(div2);

    }
    if(exam[0] === "수"){
        $("#wed_exam").append(div2);

        
    }
    if(exam[0] === "목"){
        $("#thu_exam").append(div2);

        
    }
    if(exam[0] === "금"){
        $("#fri_exam").append(div2);

    }
}

