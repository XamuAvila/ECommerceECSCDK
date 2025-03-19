// Vamos criar uma stack que vai conter todos os repositorios e imagens docker
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface ClusterStackProps extends cdk.StackProps {
    vpc: ec2.Vpc
}
export class ClusterStack extends cdk.Stack {
    //Outras stacks deverao poder acessar esse serviço;
    readonly cluster: ecs.Cluster;
    constructor(scope: Construct, id: string, props: ClusterStackProps) {
        super(scope, id, props);
        this.cluster = new ecs.Cluster(this, "ECommerceCluster", {
            vpc: props.vpc,
            clusterName: "ECommerce",
            containerInsights: true //Habilita mais ferramentas de monitoramento
        })
    }
}
