require('../css/styles.scss')

var d3 = require('d3')
var $ = jQuery = require('jquery')
var _ = require('underscore')

var shortlist = ["All courses","B.A. (P)","B.Com.(H)","B.Com.(P)","Bio-Chem","Botany","Chemistry","Computer Science","Economics","Electronics","English","Food Tech","Geography","Hindi","History","Mathematics","Micro","Micro Biology","Philosophy","Phy. Science","Physics","Political Science","Psychology","Sociology","Statistics","Zoology"]

var container_width = $(window).width()
var container_height = $(window).height(); 
var margin = {top: 20, bottom: 40, left: 20, right: 20}

var options = {
      rectWidth: (container_width<800)?13:(18),
      rectHeight: (container_width<800)?13:(18),
    };

var column_numbers = (container_width<800)?(Math.floor((container_width-margin.left-margin.right)/options.rectWidth)):40

var streamColors = {
    'Science': '#8dd3c7',
    'Arts':'#ffffb3',
    'Commerce':'#bebada',
    'Vocational': '#fb8072'
}

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
"B.Com.(H)":"Commerce",
"B.Com.(P)":"Commerce",
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

d3.csv('data/data.csv',function(error,data){

    var filtered_data = _.chain(data).filter(function(d){
        return (_.contains(shortlist, d.course))
    }).sortBy(function(d){return course_mapping[d.course]}).value()
    shortlist.forEach(function(d){
        $('#course').append("<option value = '"+d+"'>"+d+"</option>")
    })

    _.chain(filtered_data).pluck('college').uniq().value().sort().forEach(function(d){
        $('#college').append("<option value = '"+d+"'>"+d+"</option>")
    })
    
    $('#course').change(function(){
        var course_val = $(this).val()
        console.log(course_val)
        d3.selectAll('.course')
            .transition()
            .style('fill',function(d){
                if (d.course == course_val){
                    return "magenta"
                } else {
                    return "#3a3a3a"
                }
            })
    })

    $('#college').change(function(){
        var college_val = $(this).val()
        d3.selectAll('.course')
            .transition()
            .style('fill',function(d){
                if (d.college == college_val){
                    return "magenta"
                } else {
                    return "#3a3a3a"
                }
            })
    })

    var nestarray,flattened, sorted_nestarray
    var year_counter = 2008
    changeYear(2008)

    var myVar = setInterval(function(){ 
        myTimer() 
    }, 4000);

    function myTimer() {
        if (year_counter==2016){
           year_counter = 2008 
        } else {
            year_counter=year_counter+1
        }
        changeYear(year_counter)
    }

    function myStopFunction() {
        clearInterval(myVar);
    }

        // console.log(nestarray)
    
    var svg = d3.select('.viz')
        .append('svg')
        .attr('width', options.rectWidth * (column_numbers+2))
        .attr('height', container_height)
        .attr('class','chart')

    var g = svg.append('g')
                .attr('transform','translate('+margin.left+","+margin.top+")")
    var courses = g.selectAll('.course')
                    .data(filtered_data)
                    .enter()
                    .append('rect')
                    .attr('class','course')
                    .attr('width', options.rectWidth)
                  .attr('height', options.rectHeight)
                  .attr('vector-effect', 'non-scaling-stroke')
                  .style('stroke', '#fff')
                  .style('stroke-width','2')
                  .style('fill', function(d){
                        // var thing = streamColors[course_mapping[d.course]]
                        // if (thing){
                        //     return (thing)
                        // } else {
                        //     return "#ccc"
                        // }
                    })
                  .attr('transform', function(e,i){
                    var obj = _.findWhere(flattened,{college: e.college, course: e.course})
                    return 'translate('+obj.x+','+obj.y+ ')';
                })
                  .on('click',function(d){
                    console.log(d)
                  })

    $('.label').css('left',($('.chart').position().left)+(margin.left)+"px")

            $('.label').css('padding-top',(margin.top))
            $($('.label')[0]).css('padding-top','0')

    function changeYear(year){
            nestarray = d3.nest().key(function(d){
                        return getBucket(d['val'])
                    }).entries(
                         _.map(filtered_data, function(d){
                            return {
                                val: d[year+'_min'],
                                course: d.course,
                                college: d.college
                            }
                    }))

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
            
            $($('.label')[0]).css('top','0')
            

            sorted_nestarray.forEach(function(group,index){
                $('.label[data-which="'+group.key+'"] span').text(group.values.length)

                    if (index!=0){
                        var len = (sorted_nestarray[index-1].values.length)/column_numbers
                        gap = gap + Math.floor(len)

                    }
                    // some temp handling for bad math
                    if (len && (sorted_nestarray[index-1].values.length)%column_numbers==0){
                        gap = gap - 1
                    }
                    
                  group.values.forEach(function(d, i){
                    d.x = ((i % column_numbers)*options.rectWidth)
                    var line_num = Math.floor(i/column_numbers)
                    d.y = ((options.rectHeight) * ((gap)+(isFinite(line_num)?line_num:0)))+(index*4*options.rectHeight)
                    d.type = group.key
            if (group.values.length == i+1){
                $($('.label')[index+1]).css('top',(
                    options.rectHeight * ((index*5)+gap+
                                        (isFinite(line_num)?line_num:0))
                    )+'px')
                
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
                    var obj = _.findWhere(flattened,{college: d.college, course: d.course})

                    return groupColors[getBucket(obj.val)]
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
