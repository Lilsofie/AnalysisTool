import customtkinter as ctk
import VirusTotal as VirusTotal
import IPinfo as IPinfo
import MxToolBox as MxToolBox
import HetrixTools as HetrixTools

def main():
    app = App()
    app.mainloop()


class App(ctk.CTk):
   
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.geometry("1000x500")
        self.title('Analysis')

        title_label = ctk.CTkLabel(self, text="Anlyze IP, Hostname, or URL", font=ctk.CTkFont(size=30,weight="bold"))
        title_label.pack(padx=10,pady=(40,20))
        options = ["IP","Hostname","URL"]
        optionmenu= ctk.CTkOptionMenu(self,values=options,command=self.option_selected)
        optionmenu.set("choices")
        optionmenu.pack()
        self.scrollable_frame=ctk.CTkScrollableFrame(self,width=750,height=300)
        self.scrollable_frame.pack()
        self.entry = ctk.CTkEntry(self.scrollable_frame,placeholder_text=("Enter here"))
        self.entry.pack(fill="x")

    def option_selected(self,choice):
        try:
            self.label
        except:
            self.label = ctk.CTkLabel(self.scrollable_frame,text="")
            self.label.pack()
        else:
            self.label.configure(text="")
        
        if(choice == "IP"):
            self.enter_button = ctk.CTkButton(self,text="Enter",width=50,command=self.ip_analysis)
            self.enter_button.pack()
            
        elif(choice == "Hostname"):
            self.enter_button = ctk.CTkButton(self,text="Enter",width=50,command=self.domain_analysis)
            self.enter_button.pack()

        elif(choice == "URL"):
            self.enter_button = ctk.CTkButton(self,text="Enter",width=50,command=self.url_analysis)
            self.enter_button.pack()
            
     
    def ip_analysis(self):
        ip = self.entry.get()
        analysis_result = VirusTotal.getIP(ip,self.info.virusTotal)
        analysis_result += IPinfo.getIPgeo(ip,self.info.ipInfo)
        analysis_result += HetrixTools.checkIPBlackList(ip,self.info.hetrixTools)
        self.label.configure(text = analysis_result)
        self.enter_button.destroy()
        return

    def domain_analysis(self):
        domain = self.entry.get()
        if ":" in domain:
            data = domain.split(":")
            domain = data[0]
            selector = data[1]
        else:
            selector = ""
        lookup_result = MxToolBox.dnsLookup(domain,self.info.mxToolBox)
        analysis_result = lookup_result[0]
        analysis_result += MxToolBox.checkDomain(domain,selector,self.info.mxToolBox)
        analysis_result += IPinfo.getIPgeo(lookup_result[1],self.info.ipInfo)
        analysis_result += HetrixTools.checkHostBlackList(domain,self.info.hetrixTools)
        self.label.configure(text = analysis_result)
        self.enter_button.destroy()
        return

    def url_analysis(self):
        url = self.entry.get()
        analysis_result = VirusTotal.scanUrl(url,self.info.virusTotal)
        self.label.configure(text = analysis_result)
        self.enter_button.destroy()
        return

if __name__ == "__main__":
   main()