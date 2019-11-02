import openpyxl
from urllib.request import urlopen
from bs4 import BeautifulSoup

c_wb = openpyxl.load_workbook('./course.xlsx')
c_sheet = c_wb["Courses Offered"]

''' 
과목번호	과목명	AU	강:실:학	담당교수	강의시간	강의실	시험시간	성적	널널	강의	종합
'''
courses = []

for row in c_sheet.rows:
    row_value = []
    for cell in row:
        row_value.append(cell.value)

    courses.append(row_value)

c_wb.close()

print("otl searching....")
tot = len(courses)


with open("db_rating_by_prof.csv", 'w', encoding='utf-8') as f:

    for i, course in enumerate(courses):
        if(i == 0): continue

        code = course[0]
        course_name = course[1]
        prof_name = course[4]

        if("개별연구" in course_name or "졸업연구" in course_name or "논문연구" in course_name or "URP" in course_name):
            sung, nul, kang, jong = "?", "?", "?", "?"

        else:
            html = urlopen("https://otl.kaist.ac.kr/review/result/?q={}&type=ALL&department=ALL&grade=ALL&semester=NOW".format(code))  
            bsObject = BeautifulSoup(html, "html.parser")
            scores = bsObject.find_all("div", {"class":"col-xs-12 col-sm-6 score-elem"})
            
            if(len(scores) < 4):
                sung, nul, kang, jong = "?", "?", "?", "?"
            
            else:

                course_id = int(str(bsObject.find("input", {"name":"course_id"})).split("value=")[1][1:-3])
                course_html = urlopen("https://otl.kaist.ac.kr/review/result/course/{}/-1/".format(course_id))
                course_bsObject = BeautifulSoup(course_html, "html.parser")

                prof_list = course_bsObject.find_all("span", {"class": "professors"})
                for prof in prof_list:
                    if(prof_name in str(prof)):
                        review_uri = str(prof.find("a")).split('"')[1]
                        break

                review_html = urlopen("https://otl.kaist.ac.kr{}".format(review_uri))
                review_bsObject = BeautifulSoup(review_html, "html.parser")
                scores_by_prof = review_bsObject.find_all("div", {"class":"col-xs-12 col-sm-6 score-elem"})

                sung = scores_by_prof[0].text.split()[-1]
                nul = scores_by_prof[1].text.split()[-1]
                kang = scores_by_prof[2].text.split()[-1]
                jong = scores_by_prof[3].text.split()[-1]


        course[8] = sung
        course[9] = nul
        course[10] = kang
        course[11] = jong

        print("{}/{} {} {} {} {} {} {}".format(str(i), tot , course[1] , course[4] , course[8] , course[9] , course[10] , course[11]))

        for j in range(12):
            text = course[j]
            if(text == None): text = " "
            text = text.replace(",", "/")
            text = text.replace("_x000D_\n", "/")
            text = text.replace(u'\xa0', ' ')
            f.write(text)
            if(j != 11): f.write(",")
        f.write("\n")
        


