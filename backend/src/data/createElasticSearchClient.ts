import { Client } from "elasticsearch";
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'

const esHost = process.env.ES_ENDPOINT

export function createElasticSearchClient():Client {
    
    return new elasticsearch.Client({
        hosts: [ esHost ],connectionClass: httpAwsEs})
  }
  