require('../css/styles.scss')

var d3 = require('d3')
var $ = jQuery = require('jquery')
var _ = require('underscore')

var shortlist = ["B.A. (P)","B.Com. (Hons.)","B.Com. (Pass)","Biochemistry","Botany","Chemistry","Computer Science","Economics","Electronics","Food Technology","Geography","Hindi","History","Mathematics","Micro","Microbiology","Philosophy","Physical Sciences","Physics","Political Science","Psychology","Sociology","Statistics","Zoology","Sanskrit","Urdu"]

var container_width = $(window).width()
var window_height = $(window).height(); 
var container_height = (window_height<500?window_height*1.2:((window_height>550)?550:window_height))
var margin = {top: 20, bottom: 40, left: 10, right: 10}
function getRect(w){
    if (w>800){
        return 16
    } else if (w>600){
        return 13
    } else if (w>500){
        return 12
    } else{
        return 10
    }
}
var options = {
      rectWidth: getRect(container_width),
      rectHeight: getRect(container_width),
    };
var endyear = 2017
var column_numbers = (container_width<800)?(Math.floor((container_width-margin.left-margin.right)/options.rectWidth)):40

var groupColors = {
    '<70': '#A1D700',
    '70-80':'#4F9300',
    '80-90':'#2B6832',
    '>90': '#13294A',
    'Unknown': '#ccc'
}

var course_mapping = {
"Analytical Chem.":"Science",
"Analytical Chem. & Biochem":"Science",
"Anthropology":"Arts",
"Appl.Phy. Sc.:( Elect.)":"Science",
"Applied Life Sciences":"Science",
"Applied Phy. Sc":"Science",
"Applied Physical Sciences (w/ An Chem & BioChem)":"Science",
"Applied Psychology":"Science",
"Arabic":"Arts",
"B.A. (P)":"Arts",
"B.A. Voc. - Tour and Travel Manag":"Vocational",
"B.A. Voc. IRPM":"Vocational",
"B.A. Voc.- HRM":"Vocational",
"B.A. with Bengali":"Arts",
"B.A.(P)":"Arts",
"B.Com. (Hons)":"Commerce",
"B.Com. (Pass)":"Commerce",
"B.Sc. App. Life Sc.(APC)":"Science",
"B.Sc. App. Life Science":"Science",
"B.Sc. App. Phy. Sci. (Anal.Chem. & Bio-Chem.)":"Science",
"B.Sc. Appl. Phy. Sc.:( Elect.)":"Science",
"B.Sc. Chemical Sc.(Indl.Chem.)":"Science",
"B.Sc. Phy Sc. (Chem.)":"Science",
"B.Sc. Phy Sc. (Elect.)":"Science",
"B.Sc. Phy. Sc. Ind. Chem.":"Science",
"B.Sc.Appl. Life Sc.(Envir. Sc.)":"Science",
"B.Sc.Appl.Phy. Sc.:( I.C.)":"Science",
"B.Sc.Appl.Phy.Sc.(Chemistry)":"Science",
"B.Sc.Appl.Phy.Sc.(Comp.Sc.)\n":"Science",
"B.Sc.Phy. Sci. Comp. Sci.":"Science",
"BA(Voc.)":"Vocational",
"Bengali":"Arts",
"Bio-Chem":"Science",
"Biological Science":"Science",
"Biomedical Science":"Science",
"Botany":"Science",
"Chemistry":"Science",
"Commerce":"Commerce",
"Computer Science":"Science",
"Earth Sci.":"Science",
"Economics":"Commerce",
"Electronics":"Science",
"English":"Arts",
"Food Tech":"Science",
"Functional Hindi":"Arts",
"Geography":"Arts",
"Geology":"Arts",
"Hindi":"Arts",
"Hindi Patrakarita":"Arts",
"History":"Arts",
"Home Science (H)":"Science",
"Home Science (P)":"Science",
"Home Science (P) - Comb A":"Science",
"Home Science (P) - Comb B":"Science",
"Human Res. Mgt.":"Vocational",
"Ind. Chem.":"Science",
"Instrumentation":"Science",
"Journalism":"Arts",
"Life Science":"Science",
"Materials Mgt.":"Vocational",
"Mathematical Science":"Science",
"Mathematics":"Science",
"Mgt & Mktg.of Insurance":"Vocational",
"Micro":"Science",
"Micro Biology":"Science",
"Mktg. Mgt & Retail Business":"Vocational",
"OASP":"Vocational",
"OMSP":"Vocational",
"Persian":"Arts",
"Philosophy":"Arts",
"Phy. Science":"Science",
"Physics":"Science",
"Political Science":"Arts",
"Polymer Science":"Science",
"Psychology":"Arts",
"Punjabi":"Arts",
"Sanskrit":"Arts",
"Small & Medium Enterprises":"Vocational",
"Social Work":"Arts",
"Sociology":"Arts",
"Statistics":"Science",
"Tourism":"Vocational",
"Urdu":"Arts",
"Zoology":"Science",
"Zoology Appl":"Science"
}



optionlist =  ["<70","70-80","80-90",">90","Unknown"]

d3.csv('data/formatted_all_2017.csv',function(error,data){

    var filtered_data = _.chain(data).filter(function(d){
        return (_.contains(shortlist, d.course))&& d.college!="Jesus & Mary"
    }).sortBy(function(d){return course_mapping[d.course]}).value()
    shortlist.forEach(function(d){
        $('#course').append("<option value = '"+d+"'>"+d+"</option>")
    })
    $('#college').append("<option value = 'all'>all colleges</option>")
        _.chain(filtered_data).pluck('college').uniq().value().sort().forEach(function(d){
        $('#college').append("<option value = '"+d+"'>"+d+"</option>")
    })
    
    $('#course').change(function(){

        var course_val = $(this).val()
        var college_val = $('#college').val()

        if (college_val!="all" || course_val!="all"){
            $('.sentence').addClass('track')
        } else {
            $('.sentence').removeClass('track')
        }
        d3.selectAll('.course')
            .transition()
            .style('fill',function(d){
                if (college_val=='all' && course_val!='all'){
                    if (d.course == course_val){
                        return "#C3FF00"
                    } else {
                        return "#3a3a3a"
                    }

                } else if (college_val!='all' && course_val=='all'){
                    if (d.college == college_val){
                        return "#C3FF00"
                    } else {
                        return "#3a3a3a"
                    }

                } else if (college_val!='all' && course_val!='all'){
                    if (d.course == course_val&&d.college == college_val){
                        return "#C3FF00"
                    } else {
                        return "#3a3a3a"
                    }

                } else {
                    var obj = _.findWhere(flattened,{college: d.college, course: d.course})   
                    return groupColors[getBucket(obj.val)]
                }
            })

            if (college_val=='all'){
                if (course_val=='all'){
                  var filtered_colleges = _.chain(filtered_data).pluck('college').uniq().value()  
                }   else {
                    var filtered_colleges = _.chain(filtered_data).where({'course':course_val}).pluck('college').uniq().value()
                }

                
                $('#college').html('<option value="all">all colleges</option>')
                filtered_colleges.forEach(function(d){
                    $('#college').append('<option value="'+d+'">'+d+'</option>')
                })
            }
    })

    $('#college').change(function(){
        var college_val = $(this).val()
        var course_val = $('#course').val()
        if (college_val!="all" || course_val!="all"){
            $('.sentence').addClass('track')
        } else {
            $('.sentence').removeClass('track')
        }
        d3.selectAll('.course')
            .transition()
            .style('fill',function(d){
                if (college_val=='all' && course_val!='all'){
                    if (d.course == course_val){
                        return "#C3FF00"
                    } else {
                        return "#3a3a3a"
                    }

                } else if (college_val!='all' && course_val=='all'){
                    if (d.college == college_val){
                        return "#C3FF00"
                    } else {
                        return "#3a3a3a"
                    }

                } else if (college_val!='all' && course_val!='all'){
                    if (d.course == course_val&&d.college == college_val){
                        return "#C3FF00"
                    } else {
                        return "#3a3a3a"
                    }

                } else {
                    var obj = _.findWhere(flattened,{college: d.college, course: d.course})   
                    return groupColors[getBucket(obj.val)]
                }
            })

        if (course_val=='all'){
            if (college_val=='all'){
                    var filtered_courses = _.chain(filtered_data).pluck('course').uniq().value()
                }else {
                    var filtered_courses = _.chain(filtered_data).where({'college':college_val}).pluck('course').uniq().value()
                }
                
                $('#course').html('<option value="all">all courses</option>')
                filtered_courses.forEach(function(d){
                    $('#course').append('<option value="'+d+'">'+d+'</option>')
                })
            }
    })

    var nestarray,flattened, sorted_nestarray
    var year_counter = 2008
    changeYear(2008)
    var myVar
    function myTimer() {
        if (year_counter==endyear){
           year_counter = 2008 
        } else {
            year_counter=parseInt(year_counter)+1
        }
        changeYear(year_counter)
    }

    function myStopFunction() {
        clearInterval(myVar);
    }

    

    $('.fa-play').on('click',function(){
        if ($(this).hasClass('fa-play')){
            $('#play i,.play-button-new i').removeClass('fa-play')
                $('#play i,.play-button-new i').addClass('fa-pause')
            myVar = setInterval(function(){ 
                myTimer() 
                $('body').attr('playing','y')
                
            }, 3500);
        } else {
            stopSlider()
        }
        

        //scroll to partcular section on the page
        var buffer = 0
        var pos = $('.sentence').offset();
        pos.top = pos.top - buffer;
        $('html, body').animate({scrollTop:(pos.top)}, 1200);
    })

    function stopSlider(){
        myStopFunction()
        $('#play i,.play-button-new i').removeClass('fa-pause')
        $('#play i,.play-button-new i').addClass('fa-play')
        $('body').attr('playing','n')
        
        
    }

    $(document.getElementsByClassName('fa-pause')).on('click',function(){
        
        stopSlider()

    })

        // console.log(nestarray)
    
    var svg = d3.select('.viz')
        .append('svg')
        .attr('width', options.rectWidth * (column_numbers+2))
        .attr('height', container_height)
        .attr('class','chart')
        .on("mouseout", function(){
            $(".tip").hide()
        } );


    var g = svg.append('g')
                .attr('transform','translate('+margin.left+","+margin.top+")")

    var courses = g.selectAll('.course')
                    .data(filtered_data)
                    .enter()
                    .append('rect')
                    .attr('class',function(d,i){return 'course s-'+i})
                    .attr('width', options.rectWidth)
                  .attr('height', options.rectHeight)
                  .attr('vector-effect', 'non-scaling-stroke')
                  .style('stroke', '#fff')
                  .style('stroke-width','2')
                  .style('fill', function(d){
                        var obj = _.findWhere(flattened,{college: d.college, course: d.course})   
                        return groupColors[getBucket(obj.val)]
                    })
                  .attr('transform', function(e,i){
                    var obj = _.findWhere(flattened,{college: e.college, course: e.course})
                    return 'translate('+obj.x+','+obj.y+ ')';
                })
                  .on('click',function(d){
                    console.log(d)
                  })
                    .on("mouseover", function(d){
                        tipOn(d)
                        d3.select(this)
                            .style('opacity', 0.5)
                            .style('stroke-width','3')


                    })
                    .on("mouseout", function(d){
                        tipOff(d)
                        d3.select(this)
                            .style('opacity', 1)
                            .style('stroke-width','2')
                            

                    });

        var chart_pos = $('.chart').position().left
        $('.label').css('left',(chart_pos)+(margin.left)+"px")
        $('.label').css('padding-top',(margin.top))
        $($('.label')[0]).css('padding-top','0')
        $($('.label')[0]).css('top','0')



 function tipOn(d, i){
      var dat = d;
    var elem = ".course.s-" + i;
      $(".tip").empty();

      // show
      $(".tip").show();
      $(".course").removeClass("highlight");
      $(elem).addClass("highlight");
      // populate
      $(".tip").append(getSentence(dat, year_counter));
      // position

      // calculate top
      function calcTop(d){
        var obj = _.findWhere(flattened, {'course':d.course, 'college':d.college})
        var y2 =  obj.y
        var h = $(".tip").height();
        var ot = $("svg").offset().top;
        var st = $(window).scrollTop();
        var r = options.rectHeight*1.5;
        var t = y2 - r - h + ot - st + 20 ;

        if (t < 40){
          t = y2 + (h/2.7) + ot - st + 20;
          $(".tip").addClass("bottom").removeClass("top");
        } else {
          $(".tip").addClass("top").removeClass("bottom");
        }
        return t;
      }

      function calcLeft(d){
        var obj = _.findWhere(flattened, {'course':d.course, 'college':d.college})
        var x2 = obj.x
        var r = options.rectWidth/2;
        var w = $(".tip").width();
        var l = x2 - w / 2 + r;
        var m = ($(window).width() > 1200 ? 0 : margin.left-r)
        return x2 - (w / 2) + margin.left+chart_pos + r;
      }

      $(".tip").css({
        top: calcTop(dat),
        left: calcLeft(dat)
      });

      $(window).resize(function(){
        $(".tip").css({
          top: calcTop(dat),
          left: calcLeft(dat)
        });
      });
    }

function tipOff(d){
  $(".course").removeClass("highlight");
}

document.getElementById("slider").addEventListener("change", function(){
            var slider_val = document.getElementById("slider").value
            year_counter = slider_val
            changeYear(slider_val)
            
        });

    function changeYear(year){
        document.getElementById("slider").value = year;

            nestarray = d3.nest().key(function(d){
                        return getBucket(d['val'])
                    }).entries(
                         _.sortBy(_.map(filtered_data, function(d){
                                                     return {
                                                         val: parseInt(d[year+'_min'].trim()),
                                                         course: d.course,
                                                         college: d.college
                                                     }
                                             }),'val'))

            optionlist.forEach(function(d){
                if (!_.contains(_.pluck(nestarray,'key'),d)){
                    nestarray.push({
                        key: d,
                        values:[]
                    })
                }
            })
            
            sorted_nestarray = _.sortBy(nestarray,function(d){
                return optionlist.indexOf(d.key)
            })

            var gap = 1
            

            sorted_nestarray.forEach(function(group,index){

                $('.label[data-which="'+group.key+'"] span').text(group.values.length)

                     if (index!=0){
                        var len = (sorted_nestarray[index-1].values.length)/column_numbers
                        gap = gap + Math.floor(len)
                         
                    } else {
                       gap = 1
                    }
                    if (len && (sorted_nestarray[index-1].values.length)%column_numbers==0){
                            gap = gap - 1
                        }
                    // some temp handling for bad math
                  group.values.forEach(function(d, i){
                    d.x = ((i % column_numbers)*options.rectWidth)
                    var line_num = Math.floor(i/column_numbers)
                    d.y = ((options.rectHeight) * ((gap)+(isFinite(line_num)?line_num:0)))+(index*4*options.rectHeight)
                    d.type = group.key
                    if (group.values.length == i+1){
                        $($('.label')[index+1]).css('top',
                           ((options.rectHeight) * ((gap)+(isFinite(line_num)?line_num:0)))+(index*4*options.rectHeight)+(options.rectHeight*2.2)
                            +'px')
                    }

                  })
            })
            flattened = ( _.chain(sorted_nestarray).pluck('values').flatten().value())
            
            $('.year-text').html(year_counter)
            
            d3.selectAll('.course')
                .transition()
                .duration(1000)
                .attr('transform', function(e){
                    var obj = _.findWhere(flattened,{college: e.college, course: e.course})
                    return 'translate('+obj.x+','+obj.y+ ')'
                })
                .style('fill',function(d){
                    var college_val = $('#college').val()
                    var course_val = $('#course').val()

                    if (college_val=="all" && course_val=="all"){
                        var obj = _.findWhere(flattened,{college: d.college, course: d.course})   
                        return groupColors[getBucket(obj.val)]
                    } else {
                        if (college_val!='all' && course_val=='all'){
                            if (d.college == college_val){
                                if (!$('.tip').attr('style').match('none')){
                                    tipOn(d)
                                }
                                return "#C3FF00"
                            } else {
                                return "#3a3a3a"
                            }
                        } else if (course_val!='all' && college_val=='all'){
                            if (d.course == course_val){
                                if (!$('.tip').attr('style').match('none')){
                                    tipOn(d)
                                }
                                return "#C3FF00"
                            } else {
                                return "#3a3a3a"
                            }
                        } else {
                            if (d.course == course_val && d.college == college_val){
                                if (!$('.tip').attr('style').match('none')){
                                    tipOn(d)
                                }
                                return "#C3FF00"
                            } else {
                                return "#3a3a3a"
                            }
                        }
                        
                    }
                })
    }

})

function getBucket(val){
    if (+val<70){
        return "<70"
    } else if (+val <=80){
        return "70-80"
    } else if (+val <=90){
        return "80-90"
    } else if (+val >90){
        return ">90"
    } else if (val=="NA"){
        return "Unknown"
    } else {
        return "Unknown"
    }
}

function getSentence(dat, year_counter){
    var adj
    if (year_counter<2017){
        adj = 'had'
    } else {
        adj = 'has'
    }
    if (!dat[year_counter+"_min"].match(/^[0-9]/)){
        return "The "+ year_counter +" cutoff for <b>"+dat.course+" in "+dat.college+"</b> is unknown."
    } else {
        return "<b>"+dat.course+"</b> in <b>"+dat.college+"</b> "+adj+" a <b>" + dat[year_counter+"_min"]+"%</b> cutoff in <b>"+year_counter+"</b>."
    }
}

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};


