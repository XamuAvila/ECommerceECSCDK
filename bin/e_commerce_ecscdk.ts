#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/ecr-stack';
import { VpcStack } from '../lib/vpc-stack';
import { ClusterStack } from '../lib/cluster-stack';
import { LoadBalancerStack } from '../lib/lb-stack';
import { ProductsServiceStack } from '../lib/productsService-stack';
import { ApiStack } from '../lib/api-stack';

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

const vpcStack = new VpcStack(app, "Vpc", {
  env: env,
  tags: tagsInfra
})

const lbStack = new LoadBalancerStack(app, "LoadBalancer", {
  vpc: vpcStack.vpc,
  env: env,
  tags: tagsInfra
})
lbStack.addDependency(vpcStack);

const clusterStack = new ClusterStack(app, "Cluster", {
  vpc: vpcStack.vpc,
  env: env,
  tags: tagsInfra
})

clusterStack.addDependency(vpcStack);

const targsProductsService = {
  cost: "ProductsService",
  team: "SamuCode"
}

const productsServiceStack = new ProductsServiceStack(app, "ProductsService", {
  tags: targsProductsService,
  env: env,
  alb: lbStack.alb,
  nlb: lbStack.nlb,
  cluster: clusterStack.cluster,
  vpc: vpcStack.vpc,
  repository: ecrStack.productsServiceRepository
})

productsServiceStack.addDependency(lbStack)
productsServiceStack.addDependency(clusterStack)
productsServiceStack.addDependency(vpcStack)
productsServiceStack.addDependency(ecrStack)


const apiStack = new ApiStack(app, "Api", {
  tags: tagsInfra,
  env: env,
  nlb: lbStack.nlb
})

apiStack.addDependency(lbStack);
apiStack.addDependency(productsServiceStack);
