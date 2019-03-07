fetch('http://27.254.189.185:90/api/pagetime')
    .then(response => response.json())
    .then(data => {
        onSetWorkloadOrderDaily(data[0].min_date, data[0].toHomes, data[0].toStores)
    })

fetch('http://27.254.189.185:90/api/consignmentc2c')
    .then(response => response.json())
    .then(data => {
            onSetOrderBySize(data[0].orderBySize);
            onSetOrderPerCourier(data[0].orderCourier);
            onSetStatusPerByCou(data[0].statusByCou)
            onSetDeliveryPer(data[0].orderStatus)
    })

fetch('http://27.254.189.185:90/api/pagetopzone')
    .then(response => response.json())
    .then(data => {
        onSetOrderByDestinationZone(data)
    })

fetch('http://27.254.189.185:90/api/pagetop')
    .then(response => response.json())
    .then(data => {
        onSetTopTenStoreOrder(data);
    })

fetch('http://27.254.189.185:90/api/page5')
    .then(response => response.json())
    .then(data => {
        onSetFailCause(data)
    })

    //----------------------------------------------------------------------------------------------------
    //-- Open -- Graph -- Workload Order Daily -----------------------------------------------------------
    //----------------------------------------------------------------------------------------------------
    const onSetWorkloadOrderDaily = (min_date, toHomes, toStores) => {

	let minDate = min_date;
        //min Date -----------------------------------------------------------------------------------
        var today = new Date(minDate);
        var dd = today.getDate();
        
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        if(dd < 10){
            dd = '0' + dd;
        } 
        
        if(mm < 10){
            mm = '0' + mm;
        } 
        var minDate_New = dd + '/' + mm + '/' + yyyy;
        //console.log(minDate_New);
        
        let lineHead = document.querySelector('#line-head'); 
        let workload = document.querySelector('#workload');
            workload.innerHTML = `<i class="fas fa-chart-pie"></i> Workload Order Daily: <br><center> ${minDate_New} 21:00 To ${getDate()}</center>`;
        let aXis = ['x', '21', '22', '23', '00', //เวลาของ Today-1
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
                    '12', '13', '14', '15', '16', '17', '18', '19', '20']; //เวลาของ Today
        
        let toHomeList = ['To Home']; 
        let toStoreList = ['To Store']; 
        let total_HSList = ['Total']
        let toHome = 0, 
            toStore = 0, 
            total = 0; 
        
        for(let key in toHomes) { 
            //console.log(toHomes[key]) 
            toHome = toHome + toHomes[key]; 
            toHomeList.push(toHomes[key]); 

        } 
        
        for(let key in toStores) { 
            toStore = toStore + toStores[key] 
            toStoreList.push(toStores[key])
        }
        //console.log(toHomeList)
        //console.log(toStoreList)

        let i =1
        for(i=1 ; i<=24 ; i++){
            total_HS = toHomeList[i] + toStoreList[i]
            total_HSList.push(total_HS)

        }
        //console.log(total_HSList)


        total = toHome + toStore; 
        //console.log(toHome) 
        lineHead.innerHTML = `${toHomeList[0]}: ${toHome} ${toStoreList[0]}: ${toStore} Total: ${total}`; 
        
        let chart = c3.generate({ 
            bindto: '#line-chart', 
            data: { 
                x: 'x', 
                columns: [ 
                aXis, 
                toHomeList, 
                toStoreList,
                total_HSList
                ], 
                labels: true 
            },
            color: {
                fill: '#ff0000'
            },
            size: {
                height: 300 
            },
            axis: {
                x: {
                    label: { 
                        text: 'เวลา(ชม.)', 
                        position: 'outer-middle' 
                    }, 
                    type: 'category' 
                },  
                y: { 
                    label: { 
                    text: 'จำนวน(ชิ้น)', 
                    position: 'outer-middle' 
                    }, 
                    padding: {bottom: 0} 
                } 
            } 
        }); 
    }
    //----------------------------------------------------------------------------------------------------
    //-- Exit -- Graph -- Workload Order Daily
    //----------------------------------------------------------------------------------------------------



    //----------------------------------------------------------------------------------------------------
    //-- Open -- getDate
    //----------------------------------------------------------------------------------------------------
    const getDate = (num=0) => {
        
        var today = new Date();
        var hours = today.getHours();
        var dd = today.getDate() + num ;
        var minutes = today.getMinutes();

	if(minutes < 10){
            minutes = '0' + minutes;
        }

        if( dd == 00) {
          today = new Date(yyyy, mm-1, 0)
          dd = today.getDate();
          mm = today.getMonth() + 1;
          yyyy = today.getFullYear();
        }
	
     		
        var mm = today.getMonth() + 1; //January is 0!
        
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        } 
        var today = dd + '/' + mm + '/' + yyyy + ' ' + hours + ':' + minutes;
        return today;
    }
    //----------------------------------------------------------------------------------------------------
    //-- Exit -- getDate
    //----------------------------------------------------------------------------------------------------



    //----------------------------------------------------------------------------------------------------
    //-- Open -- Graph -- Order By Size
    //----------------------------------------------------------------------------------------------------
    const onSetOrderBySize = (orderBySize) => { 
        let aXis = ['x', 'ซองกระดาษ', 'ซองพลาสติก', 'Size S', 'Size M', 'Size L', 'Size XL']; 
        let polymailer = (orderBySize.polymer); 
        let satchel = (orderBySize.satchel); 
        let s = (orderBySize.sizeS); 
        let m = (orderBySize.sizeM); 
        let l = (orderBySize.sizeL); 
        let xl = (orderBySize.sizeXL); 
        let barData = ['จำนวนพัสดุ', polymailer, satchel, s, m, l, xl]; 
        let sum = (polymailer+satchel+s+m+l+xl)
        let chart = c3.generate({ 
            bindto: '#bar-chart', 
            data: { 
                x: 'x', 
                columns: [ 
                    aXis, 
                    barData 
                ], 
                type: 'bar',
                labels: {
                    format: {
                        จำนวนพัสดุ :  (v, id, i, j) => 
                        //{ return ((v/sum)*100).toFixed(0) + '%' + ', (' + v + '/' + sum + ')';
                        { return ((v/sum)*100).toFixed(2) + '%' + ', (' + v + '/' + sum + ')';
                    },
                //  data1: function (v, id, i, j) { return "Format for data1"; },
                    }
                },
                // color: function (color, d) {
                //     // d will be 'id' when called for legends
                //     return d.id && d.id === 'จำนวนพัสดุ' ? d3.rgb(255, 188, 112) : null
                // }
                
                colors: {
                    จำนวนพัสดุ : function(chartColor){
                        return  (chartColor.index === 0) ? '#eaa8a8' :
                                (chartColor.index === 1) ? '#eabfa8' :
                                (chartColor.index === 2) ? '#c1eaa8' :
                                (chartColor.index === 3) ? '#a8eadb' :
                                (chartColor.index === 4) ? '#d1a8ea' :
                                (chartColor.index === 5) ? '#eaa8cd' : null ;  
                    }     
                },
                order: null

            }, 
            bar: { 
                width: { 
                    ratio: 0.5, // this makes bar width 50% of length between ticks 
                }, 
                space: 0.5 
            }, 
            size: { 
                height: 300 
            },
            axis: { 
                x: { 
                    label: { 
                        text: 'ประเภท', 
                        position: 'outer-middle' 
                    }, 
                    type: 'category' 
                }, 
                y: { 
                    label: { 
                        text: 'จำนวน(ชิ้น)', 
                        position: 'outer-middle' 
                    } 
                } 
            }, 
            legend: { 
                hide: true 
            }, 
            grid: { 
                y: { 
                    show: true 
                } 
            },
            onrendered: function () {
                d3.selectAll("#bar-chart .c3-chart-texts text.c3-text")
                    .attr('dy', 3)
                    .attr('dx', 0)
                    .attr('y', 190)
                    .attr("transform", function(d) {
                        var textSel = d3.select(this);
                        return "rotate(270, "+textSel.attr("x")+", "+(textSel.attr("y"))+")";
                    })
                    .style("text-anchor", function(d) {
                        return (d.value && d.value > 0) ? "centre" : "centre";
                    });
                }
            }); 
    }
    //----------------------------------------------------------------------------------------------------
    //-- Exit -- Graph -- Order By Size
    //----------------------------------------------------------------------------------------------------



    //----------------------------------------------------------------------------------------------------
    //-- Open -- Graph -- Order Per Courier
    //----------------------------------------------------------------------------------------------------
    const onSetOrderPerCourier = (orderCourier) => { 
        let dynamic = ['Dynamic', orderCourier.orderDml]; 
        let sendit = ['Sendit', orderCourier.orderSendit]; 
        let alpha = ['Alpha', orderCourier.orderAlpha]; 
 
        let chart = c3.generate({ 
            bindto: '#pie-chart', 
            data: { 
                columns: [ 
                    dynamic,sendit,alpha 
                ], 
                type : 'pie' 
            }, 
            size: { 
                height: 300 
            }, 
            pie: { 
                label: { 
                    threshold: 0.1, 
                    format: (value, ratio, id) => { 
                        // return value + ' usc.';  
                        ratio = d3.format("%")(ratio); // format ratio 
                        return [id, value, ratio].join(); // used to pass values to the onrender function 
                    } 
                } 
            }, 
            onrendered: () => { 
                d3.selectAll("#pie-chart .c3-chart-arc text").each(function(v) { 
                    var label = d3.select(this); 
                    var data = label[0][0].innerHTML.split(','); 
 
                    var id = data[0]; 
                    var value = data[1]; 
                    var perc = data[2]; 
 
                d3.select(this).text("") 
                    .append("tspan") 
                    .text(id) 
                    .attr("dy", 0) 
                    .attr("x", 0) 
                    .attr("text-anchor", "middle").append("tspan") 
                // .text(parseInt(value) / 4 + " item") 
                    .text(value + " Pcs.") 
                    .attr("dy", "1.2em") 
                    .attr("x", 0) 
                    .attr("text-anchor", "middle") 
                    .append("tspan") 
                    .text(perc) 
                    .attr("dy", "1.2em") 
                    .attr("x", 0) 
                    .attr("text-anchor", "middle"); 
                }); 
            } 
        }); 
        //console.log('Check'); 
    }
    //----------------------------------------------------------------------------------------------------
    //-- Exit -- Graph -- Order Per Courier
    //----------------------------------------------------------------------------------------------------
    


    //----------------------------------------------------------------------------------------------------
    //-- Open -- Graph -- Order By Destination Zone
    //----------------------------------------------------------------------------------------------------
    const onSetOrderByDestinationZone = (data) => {
        let sNamesLists = ['x'];
        let sValueLists = ['จำนวนพัสดุ'];
        let sumValue = 0;

        var i;
        for (i = 0; i < data.length; i++) {

            sNamesLists.push(data[i].sName);
            sValueLists.push(data[i].value);

            sumValue = sumValue + data[i].value;
            //console.log(data[i].value)
        }
            
        var chart = c3.generate({
            bindto: '#zone-chart',
            data: {
                x: 'x',
                columns: [
                    sNamesLists,
                    sValueLists
                ],
                type: 'bar',
                // color: function (color, sValueLists) {
                //     // d will be 'id' when called for legends
                //     return sValueLists.id === sValueLists ? sValueLists.rgb(255, 0, 0).darker(sValueLists.value / 150) : '#ff0000';
                // },
                labels: {
                    format: {
                        จำนวนพัสดุ :  (v, id, i, j) => { return ((v/sumValue)*100).toFixed(2) + '%'+ ', (' + v + '/' + sumValue + ')'; },
                //  data1: function (v, id, i, j) { return "Format for data1"; },
                    }
                },
                color: function (color, d) {
                    // d will be 'id' when called for legends
                    return d.id && d.id === 'จำนวนพัสดุ' ? d3.rgb(255, 188, 112) : null
                }
            },
            grid: {
                x: {
                    show: false
                },
                y: {
                    show: true
                }
            },
            size: {
                height: 300
            },
            axis: {
                x: {  
                    label:{ 
                        text: 'พื้นที่',
                        position: 'outer-middle'
                    },
                    type: 'category'
                },
                y: {
                    label: {
                        text: 'จำนวน(ชิ้น)',
                        position: 'outer-middle'
                    }
                },
                rotated: true
            },
            legend: {hide: true}
        });
        chart.axis.range({max: {y: sumValue+(sumValue/5)}});
    }
    //----------------------------------------------------------------------------------------------------
    //-- Exit -- Graph -- Order By Destination Zone
    //----------------------------------------------------------------------------------------------------



    //----------------------------------------------------------------------------------------------------
    //-- Open -- Graph -- Top 10 Store Order
    //----------------------------------------------------------------------------------------------------
    const onSetTopTenStoreOrder = (data) => {
        let aXis = ['x'];
        let barData = ['จำนวนพัสดุ'];
        let sumtop = 0;
        for(let i = 0; i < data.length; i++) {
                sumtop = sumtop + data[i].iTopValue;
        }
        //console.log(sumtop)

        for(let i = 0; i < 10; i++) {
        if(data[i] === undefined) {
            break;
        }
        aXis.push(data[i].sTopCode.split(' ')[0]);
        barData.push(data[i].iTopValue);
        }
    
        let chart = c3.generate({
            bindto: '#topten-chart',
            data: {
                x: 'x',
                columns: [
                    aXis,
                    barData
                ],
                type: 'bar',           
                color: function (color, d) {
                    // d will be 'id' when called for legends
                    return d.id && d.id === 'จำนวนพัสดุ' ? d3.rgb(255, 188, 112) : null
                },
                labels: {
                    format: {
                        จำนวนพัสดุ :  (v, id, i, j) => { return ((v/sumtop)*100).toFixed(2) + '%'+ ', (' + v + '/' + sumtop + ')'; },
                //  data1: function (v, id, i, j) { return "Format for data1"; },
                    }
                }
            },
            bar: {
                width: {
                    ratio: 0.5, // this makes bar width 50% of length between ticks
                },
                space: 0.5
            },
            size: {
                height: 300
            },
            axis: {
                x: {  
                        label:{ 
                        text: 'รหัสร้าน',
                        position: 'outer-middle'
                        },
                        type: 'category'
                },
                y: {
                    label: {
                        text: 'จำนวน(ชิ้น)',
                        position: 'outer-middle'
                    }
                }
            },
            legend: { hide: true },
            grid: {
                y: {
                    show: true
                }
            },
            onrendered: function () {
                d3.selectAll("#topten-chart .c3-chart-texts text.c3-text")
                    .attr('dy', 3)
                    .attr('dx', 0)
                    .attr('y', 190)
                    .attr("transform", function(d) {
                        var textSel = d3.select(this);
                        return "rotate(270, "+textSel.attr("x")+", "+(textSel.attr("y"))+")";
                    })
                    .style("text-anchor", function(d) {
                        return (d.value && d.value > 0) ? "centre" : "centre";
                    });
                }
            
        });
    }
    //----------------------------------------------------------------------------------------------------
    //-- Exit -- Graph -- Top 10 Store Order
    //----------------------------------------------------------------------------------------------------


    //----------------------------------------------------------------------------------------------------
    //-- Open -- Graph -- Fail Cause
    //----------------------------------------------------------------------------------------------------
    const onSetFailCause = (data) => {
        let testString = 'ติดต่อไม่ได้ ปลายทางไม่รับสาย กรุณาติดต่อกลับเบอร์ 090-968-5126'
        let sNamesLists = ['x'];
        let sumAllList = ['จำนวนพัสดุ'];
        let sumByListDML = 0;
        let sumByListSendit = 0;
        let sumByListApl = 0;
        
        var i; let sum_fail = 0;
        for (i = 0; i < data.length; i++) { 
        //data[i].sName == "ลูกค้ายกเลิกจัดส่งพัสดุ" || 
            if(data[i].sName == "รอดำเนินการ" || data[i].sName == "ยกเลิกจัดส่ง"){
            }
            else{
                let failText = data[i].sName;
                failText = failText.replace("กรุณาติดต่อกลับเบอร์ 090-968-5126", "");
                sNamesLists.push(failText);
                sumAllList.push(data[i].dml + data[i].sentit + data[i].apl);
        
                sumByListDML = sumByListDML + data[i].dml;
                sumByListSendit = sumByListSendit + data[i].sentit;
                sumByListApl = sumByListApl + data[i].apl;
                
                sum_fail = sum_fail + data[i].dml + data[i].sentit + data[i].apl;
            }
        }
        //console.log(sum_fail);
        
        var chart = c3.generate({
            bindto: '#fail-cause-chart',
            data: {
                x: 'x',
                columns: [
                    sNamesLists,
                    sumAllList
                ],
                type: 'bar',
                color: function (color, sumAllList) {
                    // d will be 'id' when called for legends
                    return sumAllList.id === sumAllList ? sumAllList.rgb(255, 0, 0).darker(sumAllList.value / 150) : '#ff0000';
                },
                labels: {
                    format: {
                        จำนวนพัสดุ :  (v, id, i, j) => { return ((v/sum_fail)*100).toFixed(2) + '%' + ', (' + v + '/' + sum_fail + ')'; },
                    //  data1: function (v, id, i, j) { return "Format for data1"; },
                    }
                }
            },
            grid: {
                x: {
                    show: false
                },
                y: {
                    show: true
                }
            },
            size: {
                height: 300
            },
            axis: {
                x: {  
                    label:{ 
                    text: 'สถานะ',
                    position: 'outer-middle'
                    },
                    type: 'category'
                },
                y: {
                    label: {
                    text: 'จำนวน(ชิ้น)',
                    position: 'outer-middle'
                    }
                },
                rotated: true
            },
            legend: { hide: true }
        });
        chart.axis.range({max: {y: sum_fail+(sum_fail/5)}});
    }
    //----------------------------------------------------------------------------------------------------
    //-- Exit -- Graph -- Fail Cause
    //----------------------------------------------------------------------------------------------------


    //----------------------------------------------------------------------------------------------------
    //-- Open -- Graph -- delivery-Performance-chart
    //----------------------------------------------------------------------------------------------------
    const onSetDeliveryPer = (orderStatus) => {
        let status = ['x','Complete Deliverry', 'On Process', 'Fail'];
        let value = ['จำนวนพัสดุ', orderStatus.complete, orderStatus.onProcess, orderStatus.fail];
        let total_order = (orderStatus.complete + orderStatus.onProcess + orderStatus.fail)
        var chart = c3.generate({
            bindto: '#delivery-Performance-chart',
            data: {
                x: 'x',
                columns: [
                    status,
                    value
                ],
                type: 'bar',
                colors: {
                    จำนวนพัสดุ : function(chartColor){
                        return  (chartColor.index === 0) ? '#267c25' :
                                (chartColor.index === 1) ? '#ffee00' :
                                (chartColor.index === 2) ? '#ed1b2d' : null ;  
                    }     
                },
                labels: {
                    format: {
                        จำนวนพัสดุ :  (v, id, i, j) => { return ((v/total_order)*100).toFixed(2) + '%' + ', (' + v + '/' + total_order + ')'; },
                //  data1: function (v, id, i, j) { return "Format for data1"; },
                    },
                }
            },
            grid: {
                x: {
                    show: false
                },
                y: {
                    show: true
                }
            },
            size: { 
                height: 300
            },
            axis: {
                x: {  
                    label:{ 
                    text: 'สถานะ',
                    position: 'outer-middle'
                    },
                        type: 'category'
                },
                y: {
                    label: {
                    text: 'จำนวน(ชิ้น)',
                    position: 'outer-middle'
                    }
                },
                rotated: true
            },
            legend: {hide: true}
        });
        chart.axis.range({max: {y: total_order+(total_order/5)}});
    }
    //----------------------------------------------------------------------------------------------------
    //-- Exit -- Graph -- delivery-Performance-chart
    //----------------------------------------------------------------------------------------------------


    //----------------------------------------------------------------------------------------------------
    //-- Open -- Graph -- Status By Courier
    //----------------------------------------------------------------------------------------------------
    const onSetStatusPerByCou = (statusByCou) => {
        let Alpha_completed = ['Completed',  statusByCou.statusAlpha.completed];
        let Alpha_fail = ['On Process, Fail', statusByCou.statusAlpha.fail];
        let Sendit_completed = ['Completed',  statusByCou.statusSendit.completed];
        let Sendit_fail = ['On Process, Fail', statusByCou.statusSendit.fail];
        let DML_completed = ['Completed',  statusByCou.statusDML.completed];
        let DML_fail = ['On Process, Fail', statusByCou.statusDML.fail];

        // console.log(Alpha_completed, Alpha_fail, Sendit_completed, Sendit_fail, DML_completed, DML_fail)


        //-- Open -- Graph -- Alpha --------------------------------------------------------------------
        var chart = c3.generate({
            bindto: '#alpha-status-chart',
            data: {
                columns: [
                    Alpha_completed, Alpha_fail
                ],
                type : 'pie',
            },
            color :{
                pattern: ['#267c25', '#ed1b2d']
            },
            size: {
                height: 250
            },
            pie: {
                label: {
                    threshold: 0.1,
                    format: (value, ratio, id) => {
                        // return value + ' usc.'; 
                        ratio = d3.format("%")(ratio); // format ratio
                        return [ratio, value + " Pcs."].join(); // used to pass values to the onrender function
                        
                    }
                }
            }
        });
        //-- Exit -- Graph -- Alpha --------------------------------------------------------------------

        //-- Open -- Graph -- Sendit --------------------------------------------------------------------
        var chart = c3.generate({
            bindto: '#sendit-status-chart',
            data: {
                columns: [
                    Sendit_completed, Sendit_fail
                ],
                type : 'pie',
            },
            color :{
                pattern: ['#267c25', '#ed1b2d']
            },
            size: {
                height: 250
            },
            pie: {
                label: {
                    threshold: 0.1,
                    format: (value, ratio, id) => {
                        // return value + ' usc.'; 
                        ratio = d3.format("%")(ratio); // format ratio
                        return [ratio, value + " Pcs."].join(); // used to pass values to the onrender function
                        
                    }
                }
            }
        });
        //-- Exit -- Graph -- Sendit --------------------------------------------------------------------

        //-- Open -- Graph -- DML --------------------------------------------------------------------
        var chart = c3.generate({
            bindto: '#dml-status-chart',
            data: {
                columns: [
                    DML_completed, DML_fail
                ],
                type : 'pie',
            },
            color :{
                pattern: ['#267c25', '#ed1b2d']
            },
            size: {
                height: 250
            },
            pie: {
                label: {
                    threshold: 0.1,
                    format: (value, ratio, id) => {
                        // return value + ' usc.'; 
                        ratio = d3.format("%")(ratio); // format ratio
                        return [ratio, value + " Pcs."].join(); // used to pass values to the onrender function
                        
                    }
                }
            }
        });
        //-- Exit -- Graph -- DML --------------------------------------------------------------------

    }
    //----------------------------------------------------------------------------------------------------
    //-- Open -- Graph -- Status By Courier
    //----------------------------------------------------------------------------------------------------
