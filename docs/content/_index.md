+++
title = 'acme-proxy'
+++

## What is acme-proxy?

`acme-proxy` is a standalone ACME server built on [step-ca](https://github.com/smallstep/certificates) that operates in [registration authority (RA)](https://smallstep.com/docs/registration-authorities/) mode. It runs as a standalone server inside your enterprise environment, acting as an intermediary between your internal infrastructure and an external certificate authority service (such as Sectigo, DigiCert or ZeroSSL). It accepts certificate orders and validates certificate requests using the ACME protocol (RFC 8555), but does **NOT** sign certificates or store private keys.

{{< image src="/assets/highlevel-flow.png" alt="sequence" >}}

## Certificate issuance flow

1. Your internal server (behind a firewall perimeter) requests a certificate from `acme-proxy` using standard ACME clients like certbot, acme.sh or cert-manager.io if you're using Kubernetes.
2. `acme-proxy` presents cryptographic challenges to verify domain ownership
3. Once validation succeeds, `acme-proxy` forwards the certificate signing request to your external CA using External Account Binding (EAB)
4. The external CA signs the certificate
5. `acme-proxy` retrieves the certificate bundle and returns it to your server

{{< image src="/assets/sequence.png" alt="sequence" >}}

## Connectivity Requirements

For the ACME certificate request issuance, renewal flow to work correctly, make sure your any internal firewalls, ACLs, IPtables rules permit the following traffic.

**Client to acme-proxy (HTTPS/443)**

Your servers running certbot must be able to connect to acme-proxy over HTTPS.

```
Source          myserver.example.com
Destination     acme-proxy.example.com
Protocol        https (443)
Action          allow
```

**acme-proxy to Client (HTTP/80)**

`acme-proxy` validates HTTP-01 challenges by connecting to your servers directly on port 80. Your servers must allow inbound HTTP/80 from acme-proxy's IP — not from the public internet. This is the key security benefit: HTTP/80 exposure is limited to a trusted internal host rather than the global internet which is the case when using LetsEncrypt.

```
Source          acme-proxy.example.com
Destination     myserver.example.com
Protocol        http (80)
Action          allow
```
