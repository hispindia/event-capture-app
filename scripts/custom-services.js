/* global angular, moment, dhis2 */

'use strict';

/* Services */

/**
 * Created by mithilesh on 01/06/2018.
 */
angular.module('eventCaptureServices')
.service('AggregatedService', function( $http, $q ) {
    return {
        //http://127.0.0.1:8090/dhis/api/dataSets/qq8aqH1YPjT.json?fields=id,name,dataSetElements[dataElement[id,name]]&paging=false
        getDataElementNameUidMap: function ( dataSetUid ) {
            var dataElementNameUidMap = [];
            var def = $.Deferred();
            $http.get('../api/dataSets/' + dataSetUid + ".json?fields=id,name,dataSetElements[dataElement[id,name]]&paging=false").then(function (response) {

                //def.resolve( response.data );

                if( response.data.dataSetElements ) {
                    for(var j=0; j<response.data.dataSetElements.length; j++ ){

                        dataElementNameUidMap[ response.data.dataSetElements[j].dataElement.name ] = response.data.dataSetElements[j].dataElement.id;
                    }

                    def.resolve( dataElementNameUidMap );
                }
                else {
                    def.resolve( dataElementNameUidMap );
                }


            });
            return def;
        },

        //http://127.0.0.1:8090/dhis/api/dataValueSets.json?dataSet=qq8aqH1YPjT&orgUnit=HVVySynmfWo&period=201805
        getDataValueFromDataValueSet: function ( dataSetUid, orgUnitId, isoPeriod, dataElementUid ) {
            var dataValue= 0;
            var def = $.Deferred();
            $http.get('../api/dataValueSets.json?dataSet=' + dataSetUid + '&orgUnit=' + orgUnitId + '&period=' + isoPeriod + '&paging=false').then(function (response) {

                if( response.data.dataValues ) {
                    for(var j=0; j<response.data.dataValues.length; j++ ){

                        if(  response.data.dataValues[j].dataElement === dataElementUid){

                            dataValue = parseInt( response.data.dataValues[j].value );
                        }
                    }

                    def.resolve( dataValue );
                }
                else {
                    def.resolve( dataValue );
                }

            });
            return def;
        },
        updateAggDataValue: function( dataValue ){
            var def = $.Deferred();

            $.ajax( {
                url: '../api/dataValues',
                data: dataValue,
                type: 'post',
                success: handleSuccess,
                error: handleError
            } );

            function handleSuccess()
            {
                console.log( " SUCESS - " + dataValue );
                def.resolve(dataValue);
            }

            function handleError( xhr, textStatus, errorThrown )
            {
                console.log( " ERROR - " + dataValue );
                def.resolve(dataValue);
            }
            return def;
            //return promise;
        }
    }
});