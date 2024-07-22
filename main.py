from VirusTotal import *
from MxToolBox import *
from HetrixTools import*
from IPinfo import*




def main():
    asnLookup("AS15169","a37e1054-96ce-4e11-8698-7db038dcbc40")
    # choice = input("1: IP adddress\n2: URL scan\n3: domain check\n4: IP blacklist check\n5: Host blacklist check\nChoose action(s):")
    # if ('1' in choice):
    #     ip = input("Enter an IP address: ")
    #     getIP(ip)
    #     getIPgeo(ip)
    # if ('2' in choice):
    #     url = input("Enter an URL: ")
    #     scanUrl(url)
    # if('3' in choice):
    #     domain = input("Enter a domain: ")
    #     selector = input("Enter a DKIM selector(optional): ")
    #     checkDomain(domain,selector)
    # if('4' in choice):
    #     ip = input("Enter an IP:")
    #     checkIPBlackList(ip)
    # if('5' in choice):
    #     domain = input("Enter a domain:")
    #     checkHostBlackList(domain)
    #     dnsLookup(domain)

    return

if __name__ == "__main__":
   main()


