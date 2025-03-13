#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/ecr-stack';

const app = new cdk.App();
const env: cdk.Environment = {
  account: "654654185962",
  region: "us-east-1"
}

const tagsInfra = { // colar um adesivo de acordo com o custo de operação 
  cost: "ECommerceInfra",
  team: "SamuCode"
}
const ecrStack = new EcrStack(app, "Ecr", {
  env: env,
  tags: tagsInfra
});
