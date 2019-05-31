<template>
  <div id="avia-component">
      <div class="row filters-row">
          <div class="col col-airlines-list">
              <button class="dropdown-btn" @click="showAvia = !showAvia"><label>Авиакомпании</label><font-awesome-icon icon="chevron-down" size="sm" v-if="!showAvia"></font-awesome-icon><font-awesome-icon icon="chevron-up"  size="sm"  v-if="showAvia"></font-awesome-icon></button>
              <transition name="list">
              <div class="dropdown-content" v-if="showAvia">
                  <ul>
                      <li><input type="checkbox" id="selectAll" v-model="getAllChecked"><label for="selectAll">Все</label></li>
                      <li v-for="item in getUnigueAviaList()"><input type="checkbox" class="airlineCheckbox" :value="item.code" v-model="chosenAirlines"><label>{{item.name}}</label></li>
                  </ul>
              </div>
              </transition>
          </div>
          <div class="col col-onlydirect"><input type="checkbox" id="onlyDirect" v-model="onlyDirect"><label for="onlyDirect">Только прямые рейсы</label></div>
      </div>
      <div class="row title-row ">
          <div class="col col-avia hidden-mobile">Авиакомпания</div>
          <div class="col col-flight hidden-mobile">Рейс</div>
          <div class="col col-anytime hidden-mobile">Выбор времени</div>
          <div class="col col-time hidden-mobile">Вылет - посадка</div>
          <div class="col col-traveltime hidden-mobile">Время пути</div>
      </div>
      <div class="row trip" v-for="trip in getFilteredList">
            <div class="col col-avia">
                <p class="mobile-title">Авиакомпания</p>
                <ul>
                    <li v-for="airline in getUniqueAviaInFlight(trip.flights)"><img class="airline-logo" :src='"../assets/img/logos/"+airline.code+".png"' :alt="airline.name"></li>
                </ul>
            </div>
          <div class="col col-flight">
                <p class="mobile-title">Рейс</p>
                <span v-if="trip.flights.length==1&&trip.flights.length>0">прямой</span>
                <span v-else-if="trip.flights.length==2">через {{trip.flights[0].cities.arrivalCity}}</span>
                <span v-else>пересадки({{trip.flights.length-1}})</span></div>
          <div class="col col-anytime"><p class="mobile-title">Выбор времени</p><a href=""><span>Выбрать другое время</span><font-awesome-icon icon="chevron-down" v-if="!showAvia" :style="{color: '#44ABD8'}" size="sm"></font-awesome-icon></a><a href=""><span>Поделиться</span></a></div>
          <div class="col col-time"><p class="mobile-title">Вылет - посадка</p><strong>{{trip.flights[0].departureTime}}</strong> - {{trip.flights[trip.flights.length-1].arrivalTime}}</div>
          <div class="col col-traveltime"><p class="mobile-title">Время пути</p>{{trip.flightDuration|convertTime}}</div>
          <div class="col col-buy"><button class="buy_btn">Купить за {{trip.price|highlightThousands}} kzt</button></div>
      </div>
  </div>
</template>

<script>
import AviaData from '../assets/data.json';
export default {
  name: 'AviaTable',
  props: {
    msg: String
  },
  data(){
      return {
          AviaData,
          onlyDirect: false,
          chosenAirlines: [],
          showAvia: false
      }
  },
  computed: {
      getFilteredList: function(){
          let result = this.AviaData.filter(el => el.flights.every(el => this.chosenAirlines.includes(el.airline.code)));
          if(this.onlyDirect){
              let directList = result.filter(el => el.flights.length==1);
              return directList;
          }else{
              return result;
          }
      },
      filteredByAurlines: function(){
        let result = this.AviaData.filter(el => el.flights.every(el => this.chosenAirlines.includes(el.airline.code)));
        return result;
      },
      getAllChecked: {
          get(){
              return this.chosenAirlines.length === this.getUnigueAviaList().length ? true : false;
          },
          set(value){
              if(value){
                  this.chosenAirlines = this.getUnigueAviaList().map(el => el.code);
              }else{
                  this.chosenAirlines = [];
              }
          }  
      }
  },
  methods: {
    getUniqueAviaInFlight: (flightList) => {
        let listOfAirlines = flightList.map(e => e.airline);
        return listOfAirlines.map(e => e.code).map((e, i, final) => final.indexOf(e) ===i && i)
        .filter(e => listOfAirlines[e]).map(e => listOfAirlines[e]);
    },
    getUnigueAviaList: function(){
        let newArrayOfAllAirlines = [];
        let arayOfAllAirlines = this.AviaData.map(e => e.flights).map(e => e.map(e => e.airline))
        .forEach(item => item.forEach(e => {newArrayOfAllAirlines.push(e)}));
        let resultArray = newArrayOfAllAirlines.map(e => e["code"]).map((e, i, final) => final.indexOf(e) === i && i).
        filter(e => newArrayOfAllAirlines[e]).map(e => newArrayOfAllAirlines[e]);
        return resultArray;
    }
  },
  filters: {
      convertTime: (value) => {
          if(value<60){
              return value.toString()+" м";
          }else{
              return Math.floor(value/60).toString()+" ч " + (value%60).toString() + " м";
          }
      },
      highlightThousands: (value) => {
          return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
  },
  mounted: function(){
      this.chosenAirlines = this.getUnigueAviaList().map(el => el.code);
  }
}
</script>

<style scoped lang="scss">
    .list-enter-active, .list-leave-active{
        transition: height .5s;
    }
    .list-enter, .list-leave-to{
        opacity: 0;
    }
    #avia-component{
        margin: 100px auto 0;
        max-width: 1000px;
        .mobile-title{
            display: none;
        }
        .filters-row{
            margin-bottom: 8px;
        }
        .col-airlines-list{
            width: 171px;
            position: relative;
            display: flex;
            align-items: center;
        }
        .col-onlydirect{
            width: 200px;
            font-size: 14px;
            color: $textCol;
            display: flex;
            align-items: center;
            input{
                margin-right: 10px;
            }
        }
        .dropdown-btn{
            background: none;
            border: none;
            font-size: 14px;
            color: $textCol;
            font: 400 14px 'Open Sans';
            cursor: pointer;
            outline: 0;
            label{
                margin-right: 10px;
            }
        }
        .dropdown-content{
            position: absolute;
            background-color: $white;
            border-radius: 7px;
            width: 171px;
            top: 30px;
            box-shadow: 0px 2px 4px rgba(0,0,0, 0.2);
            ul{
                list-style: none;
                padding: 0;
                margin: 10px 0;
                li{
                    display: flex;
                    -moz-display: flex;
                    -webkit-display: flex;
                     align-items: center;
                     padding: 5px;
                     transition: all ease-in .2s;
                     &:hover{
                         background-color: rgba(0,0,0, .05);
                         cursor: pointer;
                     }
                     label{
                         margin-left: 15px;
                     }
                }
            }
        }
        input[type="checkbox"]{
            width: 20px;
            height: 20px;
            cursor: pointer;
            position: relative;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            outline: 0;
            &:before{
                content: '';
                border-radius: 5px;
                display: block;
                opacity: 1;
                position: absolute;
                width: 20px;
                height: 20px;
                border: 1px solid $textCol;
            }
            &:after{
                content: "";
                position: absolute;
                display: none;
                left: 7px;
                top: 2px;
                width: 6px;
                height: 13px;
                border: solid $white;
                border-width: 0 3px 3px 0;
                -webkit-transform: rotate(45deg);
                -ms-transform: rotate(45deg);
                transform: rotate(45deg);
            }
            &:checked::after{
                display: block;
            }
            &:checked::before{
                background-color: $btnColor;
                border-color: $btnColor;
            }
        }
        .col-avia{
            width: 155px;
        }
        .col-flight{
            width: 142px;
        }
        .col-anytime{
            width: 173px;
            a{
                display: block;
                color: $textCol;
                text-decoration: none;
                span{
                    border-bottom: 1px dashed #9EA3B7;
                    margin-right: 5px;
                }
            }
        }
        .col-time{
            width: 144px;
        }
        .col-traveltime{
            width: 170px;
        }
        .col-buy{
            width: 211px;
        }
        .title-row{
            background-color: $blue;
            color: $white;
            font-size: 13px;
            padding: 6px 15px;
        }
        .trip{
            border-bottom: 1px solid $borderColor;
            background-color: $white;
            padding: 15px;
            font-size: 12px;
            color: $textCol;
            min-height: 113px;
            .col-flight, .col-anytime, .col-time, .col-traveltime{
                padding-top: 5px;
            }
            .col-buy{
                text-align: right;
                .buy_btn{
                    width: 177px;
                    height: 40px;
                    font-size: 14px;
                    background-color: $btnColor;
                    border: none;
                    border-radius: 3px;
                    color: $white;
                    outline: 0;
                    margin-top: 5px;
                    transition: all ease-in-out .3s;
                    &:hover{
                        cursor: pointer;
                        background-color: #FEA53C;
                    }
                }
            }
            .col-avia ul{
                padding: 0;
                list-style: none;
                margin: 0;
                li{
                    margin-bottom: 10px;
                }
                .airline-logo{
                    max-width: 110px;
                    margin-left: 5px;
                }
            }
            
        }
    }
    
    @media(max-width: 1000px){
        #avia-component{
            .col{
                width: 16.666667%;
                flex-basis: 16.666667%;
            }
        }
        
    }
    @media(min-width: 768px) and (max-width: 1000px){
        #avia-component{
            .trip{
                .col-buy{
                    .buy_btn{
                        width: 100%;
                    }
                }
            }
        }
    }
    @media(max-width: 767px){
        #avia-component{
            .title-row{
                min-height: 30px;
            }
            .mobile-title{
                display: block;
                color: rgba(33, 44, 91, .8);
                margin: 5px 0;
            }
            .col{
                width: 50%;
                flex-basis: 50%;
            }
            .hidden-mobile{
                display: none;
            }
            .row{
                padding: 0 20px;
            }
            .row{
                justify-content: end;
            }
            .trip{
                padding-bottom: 15px;
                .col-buy{
                    text-align: left;
                }
            }
            .dropdown-content{
                top: 30px;
            }
        }
        
    }
    @media(max-width: 480px){
        #avia-component{
            .col-onlydirect{
                font-size: 11px;
            }
        }
        .dropdown-btn{        
            label{
                font-size: 11px;
            }
        }
    }
</style>
