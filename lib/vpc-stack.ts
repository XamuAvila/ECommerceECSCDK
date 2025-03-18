// Vamos criar uma stack que vai conter todos os repositorios e imagens docker
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class VpcStack extends cdk.Stack {
    //Outras stacks deverao poder acessar esse serviço;
    readonly vpc: ec2.Vpc;
    constructor(scope: Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);
        this.vpc = new ec2.Vpc(this, "EcommerceVPC", {
            vpcName: "ECommerceVPC",
            maxAzs: 2, //Numero de zonas
            natGateways: 0
        })
    }
}
