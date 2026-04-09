const stackProvider = {
  getStack() {
    const stack = {
      AWSTemplateFormatVersion: '2010-09-09',
      Parameters: {
        hostedName: {
          Type: 'String',
          Description: 'Base path to add to DNS Name.'
        },
        serviceName: {
          Type: 'String',
          Description: 'The name of this service'
        },
        serviceDescription: {
          Type: 'String',
          Description: 'Helpful description for the service'
        }
      },

      Resources: {
        // Already exists before import.
        // AccountCustomization: {
        //   Type: 'AWS::UXC::AccountCustomization',
        //   Properties: {
        //     // https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-uxc-accountcustomization.html#cfn-uxc-accountcustomization-accountcolor
        //     AccountColor: 'green',
        //     VisibleRegions: ['us-east-1', 'eu-west-1']
        //   }
        // },
        AdventuresInDevopsHostedZone: {
          Type: 'AWS::Route53::HostedZone',
          Properties: {
            HostedZoneConfig: {
              Comment: 'The Hosted Zone. Created separately from the Domain through the cloudformation template.'
            },
            Name: { Ref: 'hostedName' }
          }
        },

        CertificateCreation: {
          Type: 'AWS::Route53::RecordSet',
          Properties: {
            HostedZoneId: { Ref: 'AdventuresInDevopsHostedZone' },
            Name: { 'Fn::Sub': '${hostedName}.' },
            Type: 'CAA',
            TTL: '3600',
            ResourceRecords: [
              '0 issue "amazon.com"',
              '0 issuewild "amazon.com"',
              '0 issue "letsencrypt.org"',
              '0 issuewild "letsencrypt.org"'
            ]
          }
        },

        ReceiveEmailToGoogleWorkspace: {
          Type: 'AWS::Route53::RecordSet',
          Properties: {
            HostedZoneId: { Ref: 'AdventuresInDevopsHostedZone' },
            Name: { 'Fn::Sub': '${hostedName}.' },
            Type: 'MX',
            TTL: '3600',
            ResourceRecords: ['1 SMTP.GOOGLE.COM.']
          }
        },

        GlobalTXTRecord: {
          Type: 'AWS::Route53::RecordSet',
          Properties: {
            HostedZoneId: { Ref: 'AdventuresInDevopsHostedZone' },
            Name: { 'Fn::Sub': '${hostedName}.' },
            Type: 'TXT',
            TTL: '3600',
            ResourceRecords: [
              '"v=spf1 ip4:54.240.0.0/16 ip4:209.85.0.0/16 ip6:2600:1901:101::/36 include:amazonses.com include:_spf.google.com ~all"',
              '"google-site-verification=wAxUkJagluB5mLUgI0xZF5LzCg5AfUrYXwS0PKLia7w"'
            ]
          }
        },

        DmarcRecord: {
          Type: 'AWS::Route53::RecordSet',
          Properties: {
            HostedZoneId: { Ref: 'AdventuresInDevopsHostedZone' },
            Name: { 'Fn::Sub': '_dmarc.${hostedName}.' },
            Type: 'TXT',
            TTL: '300',
            ResourceRecords: ['"v=DMARC1;p=reject;pct=100"']
          }
        },
        GoogleDomainKey: {
          Type: 'AWS::Route53::RecordSet',
          Properties: {
            HostedZoneId: { Ref: 'AdventuresInDevopsHostedZone' },
            Name: { 'Fn::Sub': 'google._domainkey.${hostedName}.' },
            Type: 'TXT',
            TTL: '300',
            ResourceRecords: [
              '"v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAj7g53jG0VIVXPXzjm1m3nyaPUtXQIXvDA4aLczqvDojlcOM3GEzLdb6CG5tA+CBb4ThsL+DWqKilsdBeXd/dZXOp0NmqDvxGuwJ8HckVTp313uYSjgmigYOGLu+q6i0eBMAbHRTU0Kkrf52Fx+Q2lIrA1pK8NFq8Eze/YrBaCd6EFkHNi0HLtqAPkxzkLJ""064IlckTp6juaoz76y+++jQMlpIAc1Wq62CpE9qhrHv0hNyWG69srKgTSJFxfdhb4DXZeJukMeiShC9Eh4obuvwx9QNx1+T72Owt/MQnDCi5MwQt4yHw/qnXA8OMpbsXBQ3zV5w5gUxvi7Ry6uHILm1wIDAQAB"'
            ]
          }
        },

        AuthressLogin: {
          Type: 'AWS::Route53::RecordSet',
          Properties: {
            HostedZoneId: { Ref: 'AdventuresInDevopsHostedZone' },
            Name: { 'Fn::Sub': 'login.${hostedName}.' },
            Type: 'CNAME',
            TTL: '300',
            ResourceRecords: ['acc-bbsbvssqiftbb.hosted.authress.io']
          }
        },
        AuthressWildcardLogin: {
          Type: 'AWS::Route53::RecordSet',
          Properties: {
            HostedZoneId: { Ref: 'AdventuresInDevopsHostedZone' },
            Name: { 'Fn::Sub': '*.login.${hostedName}.' },
            Type: 'CNAME',
            TTL: '300',
            ResourceRecords: ['acc-bbsbvssqiftbb.hosted.authress.io']
          }
        },
        AuthressRecordLoginCertificateVerification: {
          Type: 'AWS::Route53::RecordSet',
          Properties: {
            HostedZoneId: { Ref: 'AdventuresInDevopsHostedZone' },
            Name: { 'Fn::Sub': '_fb455c4f38feb55b3e93a76ff74aab46.login.${hostedName}.' },
            Type: 'CNAME',
            TTL: '300',
            ResourceRecords: [{ 'Fn::Sub': 'login.${hostedName}.hosted.authress.io' }]
          }
        },
        DmarcForLoginEmail: {
          Type: 'AWS::Route53::RecordSet',
          Properties: {
            HostedZoneId: { Ref: 'AdventuresInDevopsHostedZone' },
            Name: { 'Fn::Sub': '_dmarc.login.${hostedName}.' },
            Type: 'TXT',
            TTL: '300',
            ResourceRecords: ['"v=DMARC1;p=reject;pct=100"']
          }
        },
        AuthressDomainKeyLogin: {
          Type: 'AWS::Route53::RecordSet',
          Properties: {
            HostedZoneId: { Ref: 'AdventuresInDevopsHostedZone' },
            Name: { 'Fn::Sub': 'authress._domainkey.login.${hostedName}.' },
            Type: 'CNAME',
            TTL: '300',
            ResourceRecords: ['dkim.hosted.authress.io']
          }
        },
        AuthressKa5jpsDomainKeyLogin: {
          Type: 'AWS::Route53::RecordSet',
          Properties: {
            HostedZoneId: { Ref: 'AdventuresInDevopsHostedZone' },
            Name: { 'Fn::Sub': 'ka5jps5okih6ksynxge5jbywdidmyqbu._domainkey.login.${hostedName}.' },
            Type: 'CNAME',
            TTL: '300',
            ResourceRecords: ['ka5jps5okih6ksynxge5jbywdidmyqbu.acc-bbsbvssqiftbb.mail.hosted.authress.io']
          }
        },

        AuthressKnizlhDomainKeyLogin: {
          Type: 'AWS::Route53::RecordSet',
          Properties: {
            HostedZoneId: { Ref: 'AdventuresInDevopsHostedZone' },
            Name: { 'Fn::Sub': 'knizlhsbcct2gsrghfqfsq3lt744h2ha._domainkey.login.${hostedName}.' },
            Type: 'CNAME',
            TTL: '300',
            ResourceRecords: ['knizlhsbcct2gsrghfqfsq3lt744h2ha.acc-bbsbvssqiftbb.mail.hosted.authress.io']
          }
        },
        AuthressTqiftmzDomainKeyLogin: {
          Type: 'AWS::Route53::RecordSet',
          Properties: {
            HostedZoneId: { Ref: 'AdventuresInDevopsHostedZone' },
            Name: { 'Fn::Sub': 'tqiftmz7agidaec27pyaou4qgzze4mcv._domainkey.login.${hostedName}.' },
            Type: 'CNAME',
            TTL: '300',
            ResourceRecords: ['tqiftmz7agidaec27pyaou4qgzze4mcv.acc-bbsbvssqiftbb.mail.hosted.authress.io']
          }
        },
        AuthressMailLogin: {
          Type: 'AWS::Route53::RecordSet',
          Properties: {
            HostedZoneId: { Ref: 'AdventuresInDevopsHostedZone' },
            Name: { 'Fn::Sub': 'mail.login.${hostedName}.' },
            Type: 'CNAME',
            TTL: '300',
            ResourceRecords: ['mail.hosted.authress.io']
          }
        },

        ApplicationEncryptionKey: {
          Type: 'AWS::KMS::Key',
          Properties: {
            Description: { 'Fn::Sub': 'Symmetric encryption key for ${serviceName}' },
            KeySpec: 'SYMMETRIC_DEFAULT',
            KeyUsage: 'ENCRYPT_DECRYPT',
            MultiRegion: true,
            EnableKeyRotation: false,
            KeyPolicy: {
              Version: '2012-10-17',
              Statement: [
                {
                  Sid: 'Enable IAM User Permissions',
                  Effect: 'Allow',
                  Principal: { AWS: { 'Fn::Sub': 'arn:aws:iam::${AWS::AccountId}:root' } },
                  Action: 'kms:*',
                  Resource: '*'
                }
              ]
            }
          }
        },
        ApplicationEncryptionKeyAlias: {
          Type: 'AWS::KMS::Alias',
          Properties: {
            AliasName: { 'Fn::Sub': 'alias/${serviceName}' },
            TargetKeyId: { Ref: 'ApplicationEncryptionKey' }
          }
        }

      }
    };

    // Temporarily set these values to be small so that we do not break anything. Later after fully migrating we can remove this and restore the correct values.
    Object.values(stack.Resources).filter(r => r.Type === 'AWS::Route53::RecordSet').map(r => {
      r.Properties.TTL = '300';
    });

    return stack;
  }
};

export default stackProvider;
