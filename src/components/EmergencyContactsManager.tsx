
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Phone, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { locationService, EmergencyContact } from '@/services/locationService';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const EmergencyContactsManager = () => {
  const { language } = useLanguage();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    relationship: '',
    is_primary: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const contactList = await locationService.getEmergencyContacts();
    setContacts(contactList);
  };

  const handleAddContact = async () => {
    if (!newContact.contact_name || (!newContact.contact_phone && !newContact.contact_email)) {
      toast({
        title: language === 'en' ? "Error" : "Lỗi",
        description: language === 'en' 
          ? "Please enter name and at least one contact method"
          : "Vui lòng nhập tên và ít nhất một thông tin liên hệ",
        variant: "destructive",
      });
      return;
    }

    const success = await locationService.addEmergencyContact(newContact);
    if (success) {
      toast({
        title: language === 'en' ? "Success" : "Thành công",
        description: language === 'en' 
          ? "Emergency contact has been added"
          : "Đã thêm người liên hệ khẩn cấp",
      });
      setNewContact({
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        relationship: '',
        is_primary: false
      });
      setIsAdding(false);
      loadContacts();
    } else {
      toast({
        title: language === 'en' ? "Error" : "Lỗi",
        description: language === 'en' 
          ? "Could not add contact"
          : "Không thể thêm người liên hệ",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    // Implementation for deleting contact would go here
    toast({
      title: language === 'en' ? "Feature in development" : "Chức năng đang phát triển",
      description: language === 'en' 
        ? "Delete feature will be updated soon"
        : "Tính năng xóa sẽ được cập nhật sớm",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            {language === 'en' ? 'Emergency Contacts' : 'Người liên hệ khẩn cấp'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            {language === 'en' 
              ? 'Add contacts who will receive notifications when you have an emergency'
              : 'Thêm người liên hệ để họ nhận thông báo khi bạn gặp tình huống khẩn cấp'
            }
          </p>

          {/* Existing Contacts */}
          <div className="space-y-3 mb-4">
            {contacts.map((contact) => (
              <Card key={contact.id} className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{contact.contact_name}</h4>
                        {contact.is_primary && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {language === 'en' ? 'Primary' : 'Chính'}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mt-1">
                        {contact.contact_phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {contact.contact_phone}
                          </div>
                        )}
                        {contact.contact_email && (
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {contact.contact_email}
                          </div>
                        )}
                        {contact.relationship && (
                          <div className="text-xs text-gray-500">
                            {language === 'en' ? 'Relationship: ' : 'Mối quan hệ: '}{contact.relationship}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New Contact */}
          {!isAdding ? (
            <Button onClick={() => setIsAdding(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Add Contact' : 'Thêm người liên hệ'}
            </Button>
          ) : (
            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contact_name">
                      {language === 'en' ? 'Contact Name *' : 'Tên người liên hệ *'}
                    </Label>
                    <Input
                      id="contact_name"
                      value={newContact.contact_name}
                      onChange={(e) => setNewContact({...newContact, contact_name: e.target.value})}
                      placeholder={language === 'en' ? 'Enter name' : 'Nhập tên'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_phone">
                      {language === 'en' ? 'Phone Number' : 'Số điện thoại'}
                    </Label>
                    <Input
                      id="contact_phone"
                      value={newContact.contact_phone}
                      onChange={(e) => setNewContact({...newContact, contact_phone: e.target.value})}
                      placeholder={language === 'en' ? 'Enter phone number' : 'Nhập số điện thoại'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_email">Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={newContact.contact_email}
                      onChange={(e) => setNewContact({...newContact, contact_email: e.target.value})}
                      placeholder={language === 'en' ? 'Enter email' : 'Nhập email'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="relationship">
                      {language === 'en' ? 'Relationship' : 'Mối quan hệ'}
                    </Label>
                    <Input
                      id="relationship"
                      value={newContact.relationship}
                      onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                      placeholder={language === 'en' 
                        ? 'e.g. Family, Friend, Colleague'
                        : 'Ví dụ: Gia đình, Bạn bè, Đồng nghiệp'
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_primary"
                      checked={newContact.is_primary}
                      onCheckedChange={(checked) => setNewContact({...newContact, is_primary: checked as boolean})}
                    />
                    <Label htmlFor="is_primary">
                      {language === 'en' ? 'Primary Contact' : 'Người liên hệ chính'}
                    </Label>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleAddContact} className="flex-1">
                      {language === 'en' ? 'Add' : 'Thêm'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAdding(false)}
                      className="flex-1"
                    >
                      {language === 'en' ? 'Cancel' : 'Hủy'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyContactsManager;
